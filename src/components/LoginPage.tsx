/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ShieldAlert, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginPage({ onSuccess, onGoToRegister }: LoginProps) {
  const { requestLoginOtp, verifyLoginOtp, resendAuthOtp } = useApp();

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setNotice('');
    setLoading(true);

    const res = await requestLoginOtp(email, password);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setNotice(
        res.devCode
          ? `Developer preview mode (Supabase/Mailjet not connected yet): your code is ${res.devCode}`
          : `We just emailed a 6-digit verification code to ${email}.`
      );
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setError('');
    setLoading(true);

    const res = await verifyLoginOtp(email, otpCode);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Verification failed. Please check the code and try again.');
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    const res = await resendAuthOtp(email, 'login');
    setResending(false);
    if (res.success) {
      setNotice(
        res.devCode
          ? `Developer preview mode: your new code is ${res.devCode}`
          : `A new verification code was sent to ${email}.`
      );
    } else {
      setError(res.error || 'Could not resend the code. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-[70vh] bg-stone-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md bg-white border border-stone-150 rounded-3xl p-8 shadow-xl space-y-6">

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-[0.3em] font-mono text-amber-800 uppercase font-bold">
            MEMBERS PORTAL
          </p>
          <h2 id="login-heading" className="text-2xl md:text-3xl font-serif italic text-emerald-950 font-bold uppercase tracking-wide">
            Wise Warrior Access
          </h2>
          <p className="text-xs text-stone-500 font-mono">
            {step === 'credentials'
              ? 'Log in to view reservation receipts, payments and safari updates.'
              : 'Enter the verification code we emailed you to finish signing in.'}
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div id="login-error-alert" className="p-3 bg-red-50 text-red-700 text-xs font-mono rounded-xl border border-red-100 flex items-start gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Info / OTP-sent notice */}
        {notice && !error && (
          <div id="login-otp-notice" className="p-3 bg-emerald-50 text-emerald-800 text-xs font-mono rounded-xl border border-emerald-100 flex items-start gap-2">
            <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{notice}</p>
          </div>
        )}

        {/* STEP 1: Email + Password */}
        {step === 'credentials' && (
          <form onSubmit={handleSubmitCredentials} className="space-y-4 text-xs font-mono">

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                Email Address / Account
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="login-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.j@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all placeholder:text-stone-300 font-sans text-sm text-stone-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                Password Secures
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="login-input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all placeholder:text-stone-300 font-sans text-sm text-stone-800"
                />
              </div>
            </div>

            {/* Core Sign In CTA */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-850 disabled:bg-stone-300 rounded-xl text-white font-bold tracking-widest uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs font-mono">

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="login-input-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all placeholder:text-stone-300 font-sans text-lg tracking-[0.4em] text-stone-800"
                />
              </div>
            </div>

            <button
              id="login-verify-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-850 disabled:bg-stone-300 rounded-xl text-white font-bold tracking-widest uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                id="login-back-to-credentials-btn"
                onClick={() => {
                  setStep('credentials');
                  setOtpCode('');
                  setError('');
                  setNotice('');
                }}
                className="text-[10px] text-stone-500 hover:text-emerald-950 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Email
              </button>
              <button
                type="button"
                id="login-resend-otp-btn"
                onClick={handleResend}
                disabled={resending}
                className="text-[10px] text-amber-700 hover:text-amber-900 uppercase tracking-wider font-bold cursor-pointer disabled:opacity-50"
              >
                {resending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* Redirect sign up */}
        <div className="text-center pt-2">
          <button
            id="login-to-register-btn"
            onClick={onGoToRegister}
            className="text-xs text-stone-500 font-mono hover:text-emerald-950 transition-colors uppercase tracking-widest cursor-pointer"
          >
            No account? Register Here
          </button>
        </div>

      </div>
    </div>
  );
}
