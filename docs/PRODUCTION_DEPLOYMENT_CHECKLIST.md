# ✅ WISE WARRIOR SAFARIS - PRODUCTION DEPLOYMENT CHECKLIST

**Status:** 🔴 NOT READY (Complete all items before deploying)

---

## 🔐 CRITICAL SECURITY FIXES (Must Complete)

- [ ] **Fix Issue #1:** Remove password from User.phoneNumber field
- [ ] **Fix Issue #2:** Hash passwords before OTP storage
- [ ] **Fix Issue #3:** Replace Math.random() with crypto.getRandomValues()
- [ ] **Fix Issue #4:** Move hardcoded credentials to .env.local (not in git)
- [ ] **Fix Issue #5:** Add password strength validation (12+ chars, upper, lower, number, special)
- [ ] **Fix Issue #6:** Add email verification requirement
- [ ] **Fix Issue #7:** Implement rate limiting (5 attempts per 15 minutes)
- [ ] **Fix Issue #8:** Use bcrypt/argon2 instead of SHA-256
- [ ] **Fix Issue #9:** Migrate from localStorage session to httpOnly cookies (with backend)
- [ ] **Fix Issue #10:** Add CSRF tokens to all forms
- [ ] **Fix Issue #11:** Add input sanitization (DOMPurify)
- [ ] **Fix Issue #12:** Add admin permission checks on all admin routes
- [ ] **Fix Issue #13:** Require admin auth for creating new admins
- [ ] **Fix Issue #14:** Enforce HTTPS for all environments
- [ ] **Fix Issue #15:** Add 30-minute session timeout

---

## 🛠️ BACKEND SETUP

### Database (Supabase PostgreSQL)

- [ ] Create Supabase project: https://supabase.com
- [ ] Enable Row Level Security (RLS) policies
- [ ] Create tables using supabase-schema.sql:
  ```bash
  supabase db push
  ```

**Required tables:**
- [ ] `users` (id, email, full_name, phone_number, role, created_at, email_verified)
- [ ] `bookings` (id, user_id, package_id, travelers, travel_date, status, created_at)
- [ ] `packages` (id, title, description, price, days, destinations, imageUrl)
- [ ] `countries` (id, name, image_url, slug)
- [ ] `national_parks` (id, name, country_id, description, activities)
- [ ] `contact_messages` (id, name, email, message, created_at)
- [ ] `system_settings` (key, value, updated_at)

- [ ] Enable auth: Email provider with email confirmations
- [ ] Configure email confirmation template
- [ ] Set up JWT secrets

### Email Service (Mailjet)

- [ ] Sign up at https://app.mailjet.com
- [ ] Get API Key and Secret Key
- [ ] Verify sender domain/email
- [ ] Set environment variables:
  ```
  MAILJET_API_KEY=your_api_key
  MAILJET_API_SECRET=your_secret_key
  MAILJET_FROM_EMAIL=noreply@wise-warrior-safaris.com
  MAILJET_FROM_NAME=Wise Warrior Safaris
  ```

- [ ] Deploy Supabase Edge Function:
  ```bash
  npm install -g supabase
  supabase login
  supabase link --project-ref YOUR_PROJECT_REF
  supabase functions deploy send-otp-email
  supabase secrets set MJ_APIKEY_PUBLIC=...
  supabase secrets set MJ_APIKEY_PRIVATE=...
  supabase secrets set MJ_SENDER_EMAIL=noreply@wise-warrior-safaris.com
  ```

### Google Gemini API (Optional - for AI features)

- [ ] Get API key from: https://aistudio.google.com
- [ ] Add to environment:
  ```
  VITE_GEMINI_API_KEY=your_api_key
  ```

---

## 🌐 HOSTING SETUP

### Frontend (Vercel / Netlify recommended)

- [ ] Create Vercel/Netlify account
- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set environment variables in dashboard:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  VITE_API_URL=https://api.wise-warrior-safaris.com
  VITE_SEED_ADMIN_EMAIL=admin@wise-warrior-safaris.com
  VITE_SEED_ADMIN_PASSWORD=SecureRandomPassword123!@#
  ```

- [ ] Enable automatic deployments from main branch
- [ ] Set up preview deployments for pull requests

### Domain & SSL

- [ ] Purchase domain: wise-warrior-safaris.com
- [ ] Point DNS to hosting provider
- [ ] Enable automatic SSL certificate (Let's Encrypt)
- [ ] Test HTTPS: https://www.ssllabs.com/ssltest/

---

## 🔒 SECURITY CONFIGURATION

### HTTP Headers

Set these headers on your hosting provider:

- [ ] **Strict-Transport-Security**
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

- [ ] **Content-Security-Policy**
  ```
  Content-Security-Policy: 
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net https://unpkg.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https: data:;
    font-src 'self';
    connect-src 'self' https://your-project.supabase.co https://api.mailjet.com;
    frame-ancestors 'none';
    base-uri 'self'
  ```

- [ ] **X-Content-Type-Options**
  ```
  X-Content-Type-Options: nosniff
  ```

- [ ] **X-Frame-Options**
  ```
  X-Frame-Options: DENY
  ```

- [ ] **X-XSS-Protection**
  ```
  X-XSS-Protection: 1; mode=block
  ```

- [ ] **Referrer-Policy**
  ```
  Referrer-Policy: strict-origin-when-cross-origin
  ```

### Vercel Example (vercel.json):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 📊 MONITORING & LOGGING

- [ ] Set up error tracking: https://sentry.io
  - Install: `npm install @sentry/react`
  - Configure in main.tsx
  - Get DSN and add to environment

- [ ] Set up uptime monitoring: https://uptime.com
  - Monitor https://wise-warrior-safaris.com every 5 minutes
  - Alert on downtime

- [ ] Set up log aggregation: https://www.loggly.com or https://www.papertrail.com
  - Forward application logs
  - Set up alerts for errors

- [ ] Set up analytics: https://www.plausible.io
  - Install analytics script
  - Track bookings, users, page views

---

## 🧪 TESTING BEFORE PRODUCTION

### Manual Testing Checklist

**Authentication Flow:**
- [ ] Register new user → receive email → enter code → account created
- [ ] Login existing user → receive email → enter code → logged in
- [ ] Forgot password → reset email → password changed
- [ ] Password strength validation works (rejects weak passwords)
- [ ] Rate limiting works (5 attempts blocks for 15 min)
- [ ] Session timeout after 30 min inactivity
- [ ] Logout clears session

**Booking Flow:**
- [ ] Create booking → shows success message
- [ ] Booking appears in admin dashboard
- [ ] Cannot book with past date
- [ ] Cannot book with 0 travelers
- [ ] Booking confirmation email sent
- [ ] User receives confirmation email

**Admin Dashboard:**
- [ ] Only admins can access admin page
- [ ] Add new package → appears on home
- [ ] Edit package → changes saved
- [ ] Delete package → removed from list
- [ ] Add country → appears in carousel
- [ ] Add national park → appears in details
- [ ] View all bookings with filters
- [ ] Export bookings to CSV

**Security Testing:**
- [ ] Try XSS in name field: `<img src=x onerror="alert('xss')">` → sanitized
- [ ] Try CSRF: Submit form from different domain → rejected
- [ ] Try SQL injection in email: `admin' OR '1'='1` → escaped/validated
- [ ] Try directory traversal: `../../etc/passwd` → rejected
- [ ] Try accessing admin as regular user → access denied
- [ ] Clear cookies → auto logout

### Automated Testing

```bash
# Run type checking
npm run lint

# Run security audit
npm audit

# Run tests (if created)
npm test

# Build for production
npm run build

# Preview build locally
npm run preview
```

### Load Testing

```bash
# Install load testing tool
npm install -g artillery

# Run load test (100 users, 10 requests each)
artillery run load-test.yml

# Expected: 95% response time < 2 seconds
```

File: `load-test.yml`
```yaml
config:
  target: https://wise-warrior-safaris.com
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Homepage"
    flow:
      - get:
          url: /
      - think: 5
      - get:
          url: /api/packages
```

---

## 📱 MOBILE TESTING

- [ ] Test on iPhone 12 (Safari)
- [ ] Test on iPhone SE (older device)
- [ ] Test on Samsung Galaxy (Chrome)
- [ ] Test on tablet (iPad)
- [ ] Test landscape orientation
- [ ] Test slow 4G network (DevTools throttle)
- [ ] Test with 50% battery saver mode

---

## ✉️ EMAIL TEMPLATES

- [ ] **OTP Verification Email**
  ```
  Subject: Your Wise Warrior Safaris Verification Code
  
  Hi [Name],
  
  Your verification code is: [CODE]
  
  This code expires in 10 minutes.
  
  If you didn't request this, please ignore this email.
  ```

- [ ] **Booking Confirmation Email**
  ```
  Subject: Your Safari Booking Confirmed - Ref #[BOOKING_ID]
  
  Dear [Name],
  
  Your booking is confirmed!
  Package: [PACKAGE_NAME]
  Travel Date: [DATE]
  Travelers: [COUNT]
  Price: $[PRICE]
  
  Confirmation details: [Link to booking details]
  ```

- [ ] **Welcome Email** (after registration)
  ```
  Subject: Welcome to Wise Warrior Safaris!
  
  Hi [Name],
  
  Thank you for joining! Start booking your dream safari today.
  
  [Explore packages link]
  ```

---

## 📋 PRE-LAUNCH CHECKLIST (48 hours before)

**48 hours before:**
- [ ] Run security audit by external firm
- [ ] Do full system backup
- [ ] Test disaster recovery plan
- [ ] Brief support team on system
- [ ] Prepare rollback plan if issues occur

**24 hours before:**
- [ ] Final manual testing on production environment
- [ ] Verify all email templates
- [ ] Check all links work
- [ ] Verify analytics tracking
- [ ] Test payment/booking flow end-to-end

**1 hour before:**
- [ ] Do health check on all services
- [ ] Verify database backups running
- [ ] Check monitoring/alerts configured
- [ ] Brief team on launch
- [ ] Have incident response plan ready

---

## 🚀 LAUNCH DAY

**Launch Process:**
1. Enable monitoring alerts
2. Enable rate limiting
3. Set up auto-scaling if needed
4. Start monitoring dashboards
5. Go live on social media
6. Monitor error logs closely
7. Be ready to rollback if needed

**Launch Day Support:**
- [ ] Have team monitoring for 12+ hours
- [ ] Quick response to any issues
- [ ] Collect user feedback
- [ ] Fix any critical bugs immediately
- [ ] Document any issues for post-launch

---

## 📊 POST-LAUNCH (First week)

- [ ] Monitor error rates (should be < 0.1%)
- [ ] Monitor performance (page load < 2s)
- [ ] Monitor uptime (should be > 99.9%)
- [ ] Collect user feedback
- [ ] Fix any reported issues
- [ ] Optimize slow pages
- [ ] Increase database connection pool if needed

---

## 🔄 ONGOING MAINTENANCE

### Weekly:
- [ ] Check error logs
- [ ] Review performance metrics
- [ ] Check database backups completed
- [ ] Monitor disk space

### Monthly:
- [ ] Security updates (npm packages)
- [ ] Database optimization
- [ ] Review user feedback
- [ ] Plan feature improvements
- [ ] Update dependencies: `npm audit fix`

### Quarterly:
- [ ] Security audit
- [ ] Performance testing
- [ ] Disaster recovery drill
- [ ] Update security policies

### Annually:
- [ ] Full security assessment
- [ ] Penetration testing
- [ ] Architecture review
- [ ] Capacity planning

---

## ⚠️ INCIDENT RESPONSE PLAN

**If system is down:**

1. **Immediate (0-5 min):**
   - Alert team
   - Check hosting status
   - Check database status
   - Check error logs

2. **Short term (5-30 min):**
   - Restart services
   - Check recent deployments
   - Rollback if necessary
   - Notify users

3. **Medium term (30 min - 2 hours):**
   - Root cause analysis
   - Fix the issue
   - Test on staging
   - Deploy to production

4. **Long term (after incident):**
   - Document what happened
   - Update runbooks
   - Improve monitoring
   - Prevent recurrence

---

## 🧑‍💼 TEAM RESPONSIBILITIES

| Role | Responsibility |
|------|-----------------|
| **DevOps/SysAdmin** | Server setup, monitoring, backups, scaling |
| **Backend Dev** | API security, database optimization, email setup |
| **Frontend Dev** | Security headers, input validation, HTTPS |
| **QA/Tester** | Security testing, load testing, user testing |
| **Product Manager** | Feature prioritization, user feedback |
| **Support Lead** | User support, incident response, feedback |

---

## 📞 CONTACTS & RESOURCES

**Emergency Contacts:**
- Hosting Support: Vercel/Netlify support
- Database Support: Supabase support
- Security Issues: security@wise-warrior-safaris.com
- On-call DevOps: [phone number]

**Useful Links:**
- Supabase Dashboard: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dashboard
- Mailjet Dashboard: https://app.mailjet.com
- Sentry Dashboard: https://sentry.io
- Monitoring: [your monitoring tool]

---

**Sign-off:**

- [ ] Security Lead: _________________ Date: _____
- [ ] Tech Lead: _________________ Date: _____
- [ ] Product Manager: _________________ Date: _____
- [ ] DevOps Lead: _________________ Date: _____

---

**GO/NO-GO DECISION:** 

- [ ] **GO** - All items complete, system ready for production
- [ ] **NO-GO** - Issues found, postpone launch

**Decision Date:** _________________
**Decision By:** _________________
