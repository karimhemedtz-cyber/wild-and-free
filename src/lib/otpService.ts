/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * One-Time-Password (OTP) service.
 *
 * Email delivery is handled by Mailjet through a Supabase Edge Function
 * (see `supabase/functions/send-otp-email`). This keeps the Mailjet API
 * Secret Key off the client bundle.
 *
 * If the project is not yet connected to Supabase (no VITE_SUPABASE_URL /
 * VITE_SUPABASE_ANON_KEY configured), there is no secure server-side place
 * to call Mailjet from, so this module falls back to a clearly-labelled
 * "developer preview" mode: the code is logged to the browser console and
 * surfaced in an on-screen alert so the login/registration flow can still
 * be exercised end-to-end locally. Connect Supabase + configure the Mailjet
 * secrets to enable real email delivery.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export type OtpPurpose = 'login' | 'register';

interface OtpRecord {
  codeHash: string;
  expiresAt: number;
  purpose: OtpPurpose;
  attempts: number;
  payload?: string; // JSON-serialized arbitrary data (e.g. pending user info)
}

const OTP_STORAGE_KEY = 'safari_otp_store';
const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

// ── Helpers ────────────────────────────────────────────────────────────────

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readStore(): Record<string, OtpRecord> {
  try {
    return JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, OtpRecord>) {
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(store));
}

function generateCode(): string {
  // 6-digit numeric OTP, padded with leading zeros if necessary.
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Generates a fresh OTP for the given email + purpose, persists it
 * (hashed, with an expiry) and dispatches the email via Mailjet.
 * `payload` is any JSON-serializable data you want available again when
 * the code is verified (e.g. the pending registration details).
 */
export async function createAndSendOtp(
  email: string,
  purpose: OtpPurpose,
  fullName: string,
  supabaseClient: SupabaseClient | null,
  payload?: object
): Promise<{ success: boolean; error?: string; devCode?: string }> {
  const code = generateCode();
  const codeHash = await sha256(code);
  const key = `${purpose}:${email.toLowerCase()}`;

  const store = readStore();
  store[key] = {
    codeHash,
    expiresAt: Date.now() + OTP_TTL_MINUTES * 60 * 1000,
    purpose,
    attempts: 0,
    payload: payload ? JSON.stringify(payload) : undefined,
  };
  writeStore(store);

  const sendResult = await sendOtpEmail(email, code, fullName, purpose, supabaseClient);
  return sendResult;
}

/**
 * Re-sends a code for an already pending OTP request (re-uses the stored
 * payload so the user doesn't have to re-enter their details).
 */
export async function resendOtp(
  email: string,
  purpose: OtpPurpose,
  fullName: string,
  supabaseClient: SupabaseClient | null
): Promise<{ success: boolean; error?: string; devCode?: string }> {
  const key = `${purpose}:${email.toLowerCase()}`;
  const store = readStore();
  const existing = store[key];
  if (!existing) {
    return { success: false, error: 'Your session expired. Please start again.' };
  }
  const payload = existing.payload ? JSON.parse(existing.payload) : undefined;
  return createAndSendOtp(email, purpose, fullName, supabaseClient, payload);
}

/**
 * Verifies a submitted code. On success, returns the original payload
 * (if any) and clears the OTP record. On failure, increments the attempt
 * counter and rejects after MAX_ATTEMPTS.
 */
export async function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  code: string
): Promise<{ success: boolean; error?: string; payload?: any }> {
  const key = `${purpose}:${email.toLowerCase()}`;
  const store = readStore();
  const record = store[key];

  if (!record) {
    return { success: false, error: 'No pending verification found. Please request a new code.' };
  }
  if (Date.now() > record.expiresAt) {
    delete store[key];
    writeStore(store);
    return { success: false, error: 'This code has expired. Please request a new one.' };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    delete store[key];
    writeStore(store);
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  const codeHash = await sha256(code.trim());
  if (codeHash !== record.codeHash) {
    record.attempts += 1;
    store[key] = record;
    writeStore(store);
    return { success: false, error: 'Incorrect code. Please try again.' };
  }

  delete store[key];
  writeStore(store);
  return {
    success: true,
    payload: record.payload ? JSON.parse(record.payload) : undefined,
  };
}

export function clearOtp(email: string, purpose: OtpPurpose) {
  const key = `${purpose}:${email.toLowerCase()}`;
  const store = readStore();
  delete store[key];
  writeStore(store);
}

// ── Email dispatch (Mailjet via Supabase Edge Function) ──────────────────

async function sendOtpEmail(
  email: string,
  code: string,
  fullName: string,
  purpose: OtpPurpose,
  supabaseClient: SupabaseClient | null
): Promise<{ success: boolean; error?: string; devCode?: string }> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.functions.invoke('send-otp-email', {
        body: { email, code, fullName, purpose },
      });
      if (error) {
        return { success: false, error: 'Could not send the verification email. Please try again shortly.' };
      }
      if (data && data.success === false) {
        return { success: false, error: data.error || 'Could not send the verification email.' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach the email service. Please try again shortly.' };
    }
  }

  // ── Developer preview fallback (no Supabase configured yet) ──
  // eslint-disable-next-line no-console
  console.info(`[DEV PREVIEW] OTP for ${email} (${purpose}): ${code}`);
  return { success: true, devCode: code };
}
