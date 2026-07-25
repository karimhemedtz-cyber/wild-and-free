# OTP Email Verification — Setup Guide (Mailjet + Supabase)

This project now requires a one-time-password (OTP) emailed to the user for
**every login and every registration**. There is no more bypass button and no
more hard-coded admin password.

## How it works

1. User enters email + password (login) or full name + email + phone +
   password (registration).
2. The app checks the credentials, generates a 6-digit code, and asks the
   **Supabase Edge Function** `send-otp-email` to deliver it through
   **Mailjet**.
3. The user types the code into the app. If it matches (and hasn't expired —
   10 minutes), they're signed in / their account is created.

## Why a Supabase Edge Function?

Mailjet requires an API Key + API Secret. Those must never sit inside the
browser bundle (anyone could open dev tools and steal them), so the actual
"send the email" call happens server-side, in a small serverless function
hosted by Supabase. The browser only ever talks to your own Supabase project
— never directly to Mailjet.

## One-time setup

### 1. Get Mailjet API credentials
- Sign up / log in at https://app.mailjet.com
- Go to **Account Settings → REST API → API Key Management**
- Copy your **API Key** and **Secret Key**
- Under **Sender addresses & domains**, verify the email address you want
  to send OTPs from (e.g. `no-reply@yourdomain.com`)

### 2. Connect Supabase (if you haven't already)
Create a `.env` file in the project root (this repo's `.gitignore` should
keep it out of git):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Without these two variables, the app runs in **local/preview mode**: OTP
codes are written to the browser console instead of emailed, so you can
still test the whole flow before Mailjet is wired up.

### 3. Deploy the edge function
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase functions deploy send-otp-email
```

### 4. Set the Mailjet secrets on Supabase
```bash
supabase secrets set MJ_APIKEY_PUBLIC=your_mailjet_api_key
supabase secrets set MJ_APIKEY_PRIVATE=your_mailjet_secret_key
supabase secrets set MJ_SENDER_EMAIL=no-reply@yourdomain.com
supabase secrets set MJ_SENDER_NAME="African Wise Warrior Safaris"
```

That's it — once these secrets are set and the function is deployed, real
emails will go out through Mailjet automatically.

## Default administrator account

Since the old "Quick Admin Bypass" button and the `admin@wise-warrior.com /
admin123` shortcut have been removed, a real seeded admin account is created
automatically the first time the app loads (local/no-Supabase mode):

- **Email:** `Karimuhemedi@yahoo.com`
- **Password:** `0750916698`

Log in with this email + password as usual — you'll still receive (or see in
the console, in preview mode) a one-time code to finish signing in. From the
**Admin Dashboard → Users** tab you can add more administrators (name, email,
password) or change this seeded password by adding a new admin with a
different password and using that one going forward.

> **Note on Supabase-connected production deployments:** the in-app "Add
> Administrator" form uses Supabase's standard `auth.signUp`, which is
> convenient for getting started but is not how most teams manage admin
> accounts at scale (it doesn't require an existing admin session and can
> briefly swap the active browser session). For production, consider
> creating admin accounts directly from the Supabase Dashboard or with a
> small script that uses your Service Role key instead.

## What changed (file by file)

| File | Change |
|---|---|
| `src/App.tsx` | Home page now shows only the 3 latest packages, with a "More Packages" button that jumps to the full Packages page. The "Evaluation Tip" developer banner was removed. |
| `index.html` | Added the Google Translate website-widget script (translates the whole site into 100+ languages). |
| `src/index.css` | Styling to make the translate widget match the site's look instead of Google's default boxy banner. |
| `src/components/Header.tsx` | Added the language-selector widget next to the login/account area, visible on every page. |
| `src/lib/otpService.ts` | **New.** Generates, stores, verifies and re-sends OTP codes; calls the Supabase Edge Function to actually send the email. |
| `supabase/functions/send-otp-email/index.ts` | **New.** Server-side function that calls Mailjet's Send API. |
| `src/context/AppContext.tsx` | Removed the admin bypass + hard-coded password + "any unregistered email becomes an account" shortcut. Added `requestRegisterOtp`/`verifyRegisterOtp`/`requestLoginOtp`/`verifyLoginOtp`/`resendAuthOtp`/`addAdminUser`. Seeds the default admin account on first load. |
| `src/components/LoginPage.tsx` | Rewritten as a 2-step flow: credentials → emailed OTP code. No more bypass button. |
| `src/components/RegisterPage.tsx` | Rewritten as a 2-step flow: details → emailed OTP code. |
| `src/components/AdminDashboard.tsx` | Package image field renamed to "Package Picture" with the URL bar removed and the button renamed to "Import Picture". Added a day-by-day itinerary builder ("Add Day" button → Day 1, Day 2, … each with its own description box). Added a new **Users** tab to add more administrators. |
| `tsconfig.json` | Excluded the `supabase/` folder, since those functions run on Deno, not in the browser project. |

## Things you'll want to double check before going live

- Replace the placeholder Mailjet sender email/name with your real verified
  domain sender.
- Decide if you want to keep the default seeded admin password
  (`0750916698`) — you can change it by adding a new admin from the Users
  tab and retiring the old one, or by editing `SEED_ADMIN_PASSWORD` in
  `AppContext.tsx` before first deploy.
- The Google Translate widget is the most practical way to cover "all
  languages in the world" without manually translating every string — but
  it is Google's own service, so translation quality and uptime depend on
  Google, not on us.
