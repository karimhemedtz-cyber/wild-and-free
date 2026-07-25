// @license SPDX-License-Identifier: Apache-2.0
//
// Supabase Edge Function: send-otp-email
// ----------------------------------------------------------------------------
// Sends a one-time-password (OTP) email using Mailjet's transactional Send API.
// This runs server-side (Deno, on Supabase's infrastructure) so the Mailjet
// API Key / Secret Key are never exposed to the browser.
//
// Deploy:
//   supabase functions deploy send-otp-email
//
// Required secrets (set these once per project):
//   supabase secrets set MJ_APIKEY_PUBLIC=xxxxxxxx
//   supabase secrets set MJ_APIKEY_PRIVATE=xxxxxxxx
//   supabase secrets set MJ_SENDER_EMAIL=no-reply@yourdomain.com
//   supabase secrets set MJ_SENDER_NAME="African Wise Warrior Safaris"
//
// MJ_APIKEY_PUBLIC / MJ_APIKEY_PRIVATE come from your Mailjet account under
// Account Settings -> REST API -> API Key Management.
// MJ_SENDER_EMAIL must be a sender/domain you have verified inside Mailjet.
// ----------------------------------------------------------------------------

// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  code: string;
  fullName?: string;
  purpose?: 'login' | 'register';
}

function buildEmailHtml(code: string, fullName: string, purpose: string) {
  const heading = purpose === 'register' ? 'Verify your new account' : 'Your sign-in code';
  const intro =
    purpose === 'register'
      ? 'Use the code below to verify your email address and finish creating your account.'
      : 'Use the code below to finish signing in to your account.';

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#fdfcf7;padding:32px;color:#1c1917;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #eadfcd;">
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7a5a22;font-weight:bold;margin:0 0 8px;">
        African Wise Warrior Safaris
      </p>
      <h1 style="font-size:20px;margin:0 0 16px;color:#1a3c34;">${heading}</h1>
      <p style="font-size:14px;line-height:1.6;color:#44403c;margin:0 0 24px;">
        Hello ${fullName || 'there'}, ${intro}
      </p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;background:#f6f2e5;border-radius:12px;padding:20px;color:#1a3c34;">
        ${code}
      </div>
      <p style="font-size:12px;color:#78716c;margin-top:24px;">
        This code expires in 10 minutes. If you did not request this, you can safely ignore this email.
      </p>
    </div>
  </div>`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, code, fullName, purpose }: RequestBody = await req.json();

    if (!email || !code) {
      return new Response(JSON.stringify({ success: false, error: 'Missing email or code.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const MJ_APIKEY_PUBLIC = Deno.env.get('MJ_APIKEY_PUBLIC');
    const MJ_APIKEY_PRIVATE = Deno.env.get('MJ_APIKEY_PRIVATE');
    const MJ_SENDER_EMAIL = Deno.env.get('MJ_SENDER_EMAIL');
    const MJ_SENDER_NAME = Deno.env.get('MJ_SENDER_NAME') || 'African Wise Warrior Safaris';

    if (!MJ_APIKEY_PUBLIC || !MJ_APIKEY_PRIVATE || !MJ_SENDER_EMAIL) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Mailjet is not configured on the server. Set MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE and MJ_SENDER_EMAIL as Supabase secrets.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const basicAuth = btoa(`${MJ_APIKEY_PUBLIC}:${MJ_APIKEY_PRIVATE}`);

    const mailjetRes = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: MJ_SENDER_EMAIL, Name: MJ_SENDER_NAME },
            To: [{ Email: email }],
            Subject:
              purpose === 'register'
                ? 'Verify your African Wise Warrior Safaris account'
                : 'Your African Wise Warrior Safaris sign-in code',
            HTMLPart: buildEmailHtml(code, fullName || '', purpose || 'login'),
            TextPart: `Your verification code is ${code}. It expires in 10 minutes.`,
          },
        ],
      }),
    });

    const mjData = await mailjetRes.json();

    if (!mailjetRes.ok) {
      return new Response(
        JSON.stringify({ success: false, error: 'Mailjet rejected the request.', details: mjData }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Unexpected error.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
