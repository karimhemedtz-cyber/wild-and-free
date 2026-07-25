# 🔴 WISE WARRIOR SAFARIS - SECURITY AUDIT & BUG REPORT
**Tarehe:** July 24, 2026  
**Status:** ⚠️ CRITICAL ISSUES FOUND  
**Severity:** HIGH - Production Not Ready

---

## 📋 EXECUTIVE SUMMARY

Mfumo huu una **15+ security vulnerabilities** na bugs ambayo inafanya haiwezi kutumika kwa production. Kwa sasa inatosha kwa development/demo tu.

---

## 🔴 CRITICAL SECURITY ISSUES

### 1. **PASSWORD STORED IN USER PROFILE (Line 210, AppContext.tsx)**
**Severity:** 🔴 CRITICAL  
**Issue:** Admin seed password stored in `phoneNumber` field
```typescript
// ❌ WRONG
const seedAdmin: User = {
  id: 'admin-seed-...',
  email: SEED_ADMIN_EMAIL,
  fullName: SEED_ADMIN_NAME,
  phoneNumber: SEED_ADMIN_PASSWORD,  // ← PASSWORD EXPOSED!
  role: 'admin',
  createdAt: new Date().toISOString(),
};
```
**Impact:** 
- Password visible in localStorage kwa macho yote
- Backend logs might capture it
- Shared devices = account compromise

**Fix:**
```typescript
phoneNumber: '', // Leave empty, password stored separately in 'safari_credentials'
```

---

### 2. **PLAINTEXT PASSWORD IN OTP PAYLOAD (Line 259, AppContext.tsx)**
**Severity:** 🔴 CRITICAL  
**Issue:** Password stored in localStorage during registration
```typescript
// ❌ WRONG
const passwordPlain = password; // stored for 10 minutes in localStorage
return createAndSendOtp(email, 'register', fullName, supabase, { 
  email, 
  fullName, 
  phone, 
  passwordPlain  // ← EXPOSED IN BROWSER STORAGE
});
```
**Impact:**
- Password lingering in localStorage kama 10 min
- Developer tools → Application tab → localStorage → exposed
- XSS attack steals it easily

**Fix:**
```typescript
// Hash password before storing in OTP payload
const passwordHash = await hashPassword(password);
return createAndSendOtp(email, 'register', fullName, supabase, { 
  email, 
  fullName, 
  phone, 
  passwordHash  // ← Hashed instead
});

// Then verify hash during account creation
```

---

### 3. **WEAK RANDOM ID GENERATION**
**Severity:** 🔴 CRITICAL  
**Issue:** Using `Math.random()` instead of cryptographic UUIDs
```typescript
// ❌ WEAK - Predictable IDs
id: 'usr-' + Math.random().toString(36).substr(2, 9)
id: 'admin-' + Math.random().toString(36).substr(2, 9)
```
**Impact:**
- IDs predictable → User A can guess User B's ID
- Can enumerate all users by guessing sequential IDs
- Violates security principle of unpredictable identifiers

**Fix:**
```typescript
// Use crypto-native UUID
import { v4 as uuidv4 } from 'uuid';
id: uuidv4()  // ← Cryptographically random
```

---

### 4. **HARDCODED ADMIN CREDENTIALS IN SOURCE CODE**
**Severity:** 🔴 CRITICAL  
**Issue:** Production admin credentials visible in git history
```typescript
// AppContext.tsx lines 11-12
const SEED_ADMIN_EMAIL = 'Karimuhemedi@yahoo.com';
const SEED_ADMIN_PASSWORD = '0750916698';
```
**Impact:**
- Anyone with repo access knows admin credentials
- Password visible in git log forever
- OTP_SETUP.md tells people the default password

**Fix:**
```typescript
// Use environment variables instead
const SEED_ADMIN_EMAIL = import.meta.env.VITE_SEED_ADMIN_EMAIL || '';
const SEED_ADMIN_PASSWORD = import.meta.env.VITE_SEED_ADMIN_PASSWORD || '';
// Add to .env.local (not in git)
```

---

### 5. **NO PASSWORD STRENGTH VALIDATION**
**Severity:** 🔴 HIGH  
**Issue:** Users can set passwords like "123" or "password"
```typescript
// No validation anywhere in LoginPage.tsx or RegisterPage.tsx
const res = await requestLoginOtp(email, password); // ← Any string accepted
```
**Impact:**
- Brute force attacks trivial
- Users choose weak passwords
- No minimum length/complexity requirements

**Fix:**
```typescript
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) return { valid: false, error: 'Min 12 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Need uppercase' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Need lowercase' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Need number' };
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, error: 'Need special char' };
  return { valid: true };
}
```

---

### 6. **NO EMAIL VERIFICATION**
**Severity:** 🔴 HIGH  
**Issue:** Account created without verifying email ownership
```typescript
// Registration accepts any email, no verification
const newUser: User = {
  id: 'usr-...',
  email,  // ← Could be typo or fake
  // ...
};
```
**Impact:**
- User enters "john@gmial.com" (typo), account created
- Attacker signs up with victim's email
- Password reset emails go to wrong person

**Fix:**
```typescript
// Add email_verified flag to User type
interface User {
  email_verified: boolean;  // New field
  // ... rest
}

// Only allow certain features until verified
if (!user.email_verified) {
  return { success: false, error: 'Please verify your email first' };
}
```

---

### 7. **NO RATE LIMITING ON AUTH ENDPOINTS**
**Severity:** 🔴 HIGH  
**Issue:** Brute force possible - infinite login attempts
```typescript
// LoginPage allows unlimited attempts without pause
for (let i = 0; i < 1000000; i++) {
  await requestLoginOtp('admin@wise.com', password);  // ← No rate limit!
}
```
**Impact:**
- Attacker can try all passwords quickly
- OTP email spam (1000s of emails sent)
- DoS attack on Mailjet/Supabase

**Fix:**
```typescript
// Track login attempts per IP/email
const loginAttempts: Record<string, { count: number; resetAt: number }> = {};

async function checkRateLimit(email: string): Promise<boolean> {
  const key = email.toLowerCase();
  const now = Date.now();
  
  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 1, resetAt: now + 15*60*1000 }; // 15 min
    return true;
  }
  
  if (now > loginAttempts[key].resetAt) {
    loginAttempts[key] = { count: 1, resetAt: now + 15*60*1000 };
    return true;
  }
  
  if (loginAttempts[key].count >= 5) return false; // Max 5 attempts per 15 min
  loginAttempts[key].count++;
  return true;
}
```

---

### 8. **PASSWORD HASHING TOO SIMPLE**
**Severity:** 🔴 HIGH  
**Issue:** Using raw SHA-256 instead of bcrypt/argon2
```typescript
// Line 18-26, AppContext.tsx
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);  // ← No salt!
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
```
**Impact:**
- SHA-256 is fast → good for attackers (1B hashes/sec on GPU)
- No salt → rainbow tables work
- Same password always same hash → pattern recognition

**Fix:**
```typescript
// Use proper password hashing library
import * as argon2 from 'argon2-browser';
async function hashPassword(password: string): Promise<string> {
  const result = await argon2.hash({
    pass: password,
    salt: crypto.getRandomValues(new Uint8Array(16)),
    hashLen: 32,
  });
  return result.encoded; // Includes salt + iterations
}
```

---

### 9. **LOCALSTORAGE STORES CURRENT USER SESSION**
**Severity:** 🔴 HIGH  
**Issue:** Session stored unencrypted in localStorage
```typescript
// Line 225, AppContext.tsx
const storedUser = localStorage.getItem('safari_current_user');
setCurrentUser(JSON.parse(storedUser));

// localStorage can be cleared/stolen
localStorage.removeItem('safari_current_user'); // Session gone
```
**Impact:**
- User gets logged out if localStorage cleared (normal browser action)
- XSS attack steals session immediately
- No session timeout
- Shared device = user sees another user's data

**Fix:**
```typescript
// Use httpOnly cookies instead (server-only, not accessible via JS)
// Store token in memory, refresh from server
// Add session timeout after 30 min inactivity
```

---

### 10. **NO CSRF PROTECTION**
**Severity:** 🔴 HIGH  
**Issue:** No CSRF tokens on form submissions
```typescript
// BookingModal - no CSRF token
const handleSubmit = async (e: React.FormEvent) => {
  await createBooking({  // ← No token verification
    fullName,
    email,
    phoneNumber,
    packageId,
    // ...
  });
};
```
**Impact:**
- Attacker creates fake booking form on their site
- User's browser auto-submits booking without consent
- Fake bookings, wrong packages selected

**Fix:**
```typescript
// Backend generates CSRF token
const csrfToken = crypto.randomUUID();
session.csrfToken = csrfToken;

// Frontend includes token
const handleSubmit = async (e: React.FormEvent) => {
  await createBooking({
    ...data,
    _csrf: csrfToken,  // ← Added
  });
};

// Backend validates
if (request.body._csrf !== session.csrfToken) {
  return { success: false, error: 'Invalid request' };
}
```

---

### 11. **NO INPUT SANITIZATION (XSS VULNERABILITY)**
**Severity:** 🔴 HIGH  
**Issue:** User input rendered without escaping
```typescript
// BookingModal.tsx
<input
  value={fullName}  // ← If fullName = "<img src=x onerror=alert('xss')>"
  onChange={(e) => setFullName(e.target.value)}
/>

// Later rendered in display
<p>{selectedPkgDetails.title}</p>  // ← Could contain HTML
```
**Impact:**
- Attacker enters `"><script>fetch('/api/users')` as name
- Script executes in other users' browsers
- Steal sessions, modify bookings, deface site

**Fix:**
```typescript
// React escapes by default in JSX, but check external data
// Use DOMPurify for HTML content
import DOMPurify from 'dompurify';

const cleanName = DOMPurify.sanitize(fullName);
<p>{cleanName}</p>

// Or use content security policy
// Content-Security-Policy: default-src 'self'; script-src 'self'
```

---

### 12. **NO AUTHENTICATION ON ADMIN ENDPOINTS**
**Severity:** 🔴 HIGH  
**Issue:** Any user can add packages/countries without permission check
```typescript
// AdminDashboard.tsx - No permission verification
const handleAddCountry = async (e: React.FormEvent) => {
  // No check if currentUser.role === 'admin'
  await addCountry(name, imageUrl);  // ← Regular user can call this
};
```
**Impact:**
- Regular user modifies all packages
- Delete all countries
- Spam the system with fake data

**Fix:**
```typescript
const handleAddCountry = async (e: React.FormEvent) => {
  if (currentUser?.role !== 'admin') {
    setError('Admin access required');
    return;
  }
  await addCountry(name, imageUrl);
};
```

---

### 13. **LOCAL ADMIN CREATION NO AUTHENTICATION**
**Severity:** 🔴 MEDIUM  
**Issue:** Anyone can create admin accounts in local mode
```typescript
// AppContext.tsx - addAdminUser
const addAdminUser = async (fullName: string, email: string, password: string) => {
  // No check if caller is admin!
  if (isSupabaseConnected && supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });  // ← No permission check
  }
  // ... rest
};
```
**Impact:**
- User can make themselves admin
- Multiple admins created without authorization

**Fix:**
```typescript
const addAdminUser = async (fullName: string, email: string, password: string) => {
  // ✅ FIX: Check if caller is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return { success: false, error: 'Admin access required' };
  }
  
  // ... rest of function
};
```

---

### 14. **NO HTTPS ENFORCEMENT**
**Severity:** 🔴 MEDIUM  
**Issue:** No requirement for HTTPS deployment
**Impact:**
- Network attacker intercepts passwords over HTTP
- Man-in-the-middle attacks
- OTP codes sent in plain HTTP

**Fix:**
```typescript
// Add to package.json scripts for production build
// Environment check during build
if (!import.meta.env.VITE_API_URL?.startsWith('https://')) {
  throw new Error('API URL must use HTTPS in production');
}
```

---

### 15. **NO SESSION TIMEOUT**
**Severity:** 🟠 MEDIUM  
**Issue:** User stays logged in forever
```typescript
// No logout after inactivity
const storedUser = localStorage.getItem('safari_current_user');
setCurrentUser(JSON.parse(storedUser)); // Forever unless manual logout
```
**Impact:**
- Attacker gets access if computer left unattended
- Shared devices = permanent access
- No security for sensitive data

**Fix:**
```typescript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let lastActivityTime = Date.now();

document.addEventListener('click', () => {
  lastActivityTime = Date.now();
});

setInterval(() => {
  if (Date.now() - lastActivityTime > SESSION_TIMEOUT) {
    signOut();
  }
}, 60000);
```

---

## 🟠 MAJOR BUGS & ISSUES

### 16. **NO DATA BACKUP/RECOVERY**
**Severity:** 🟠 MEDIUM  
**Issue:** All data in localStorage only - one browser cache clear = lost
```typescript
// No export/backup feature
localStorage.clear(); // → All bookings, users, packages gone forever
```
**Fix:** Add database backup & export feature

---

### 17. **BOOKING VALIDATION INSUFFICIENT**
**Severity:** 🟠 MEDIUM  
**Issue:** No validation of travel dates
```typescript
// BookingModal - accepts past dates
const [travelDate, setTravelDate] = useState('');
// No check if travelDate > today
```
**Fix:**
```typescript
if (new Date(travelDate) < new Date()) {
  return { success: false, error: 'Travel date must be in the future' };
}
```

---

### 18. **MISSING BOOKING CONFIRMATION EMAIL**
**Severity:** 🟠 MEDIUM  
**Issue:** No email sent after booking
```typescript
// BookingModal - booking created but user never receives confirmation
await createBooking({ /* ... */ });
```
**Fix:** Send booking confirmation email via Mailjet

---

### 19. **IMAGE URLS NOT VALIDATED**
**Severity:** 🟠 MEDIUM  
**Issue:** Admin can add broken image URLs
```typescript
// AdminDashboard - imageUrl field has no validation
const [imageUrl, setImageUrl] = useState('');
// Could be "htp://fake.com/image" or "../../../etc/passwd"
```
**Fix:**
```typescript
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('image');
  } catch {
    return false;
  }
}
```

---

### 20. **ITINERARY DAY ORDERING CAN BREAK**
**Severity:** 🟠 MEDIUM  
**Issue:** Days not validated - can have Day 0, Day 5, Day 2
```typescript
// AdminDashboard itinerary
itinerary: [
  { day: 5, title: '...', description: '...' },  // ← Wrong order
  { day: 1, title: '...', description: '...' },
  { day: 2, title: '...', description: '...' },
]
```
**Fix:** Sort by day number and validate sequence

---

## 🟡 MINOR ISSUES & UX PROBLEMS

### 21. **NO ERROR HANDLING IN ASYNC OPERATIONS**
Many try/catch blocks catch but don't properly recover:
```typescript
// Line 295-296 in AppContext.tsx
} catch (err: any) {
  return { success: false, error: err.message };  // Generic error
}
```
**Fix:** Log errors to monitoring service, give specific user feedback

---

### 22. **UNSPLASH IMAGES NOT SELF-HOSTED**
**Issue:** Images from Unsplash can disappear/change
```typescript
imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801'
```
**Fix:** Self-host critical images

---

### 23. **NO MOBILE NUMBER VALIDATION**
```typescript
phoneNumber: '+14155552671',  // No validation it's real
```
**Fix:** Use libphonenumber-js to validate

---

### 24. **FLOATING WHATSAPP HARDCODED**
```typescript
// FloatingWhatsApp.tsx - WhatsApp number hardcoded
const whatsappNumber = '256...';  // Not configurable
```
**Fix:** Use `settings.whatsapp` from admin dashboard

---

### 25. **NO FORGOT PASSWORD FEATURE**
Users can't reset password if forgotten. Only admin reset possible.

---

## 📊 VULNERABILITY SEVERITY BREAKDOWN

| Severity | Count | Issues |
|----------|-------|--------|
| 🔴 CRITICAL | 8 | Passwords in storage, weak IDs, no email verify, hardcoded creds, no rate limit, weak hashing, no CSRF, XSS |
| 🟠 HIGH | 5 | No auth check, no session timeout, no input sanitization, no admin auth |
| 🟡 MEDIUM | 12+ | Missing emails, broken validation, error handling, image hosting |

---

## ✅ RECOMMENDATIONS (PRIORITY ORDER)

### MUST DO BEFORE PRODUCTION:
1. ✅ Move passwords from localStorage to Supabase auth
2. ✅ Use Supabase's built-in authentication instead of custom OTP
3. ✅ Add admin permission checks on all admin routes
4. ✅ Implement proper password hashing (bcrypt/argon2)
5. ✅ Add email verification requirement
6. ✅ Implement rate limiting (5 attempts per 15 min)
7. ✅ Use HTTPS-only with HSTS header
8. ✅ Add CSRF tokens to all forms
9. ✅ Validate all input server-side
10. ✅ Add session timeout (30 min inactivity)

### SHOULD DO WITHIN 1 MONTH:
11. Add password strength validation
12. Implement email confirmation emails
13. Add booking confirmation emails
14. Add image URL validation
15. Implement error tracking (Sentry)
16. Add automated backups

### NICE TO HAVE:
17. Add two-factor authentication
18. Add audit logging
19. Add admin activity dashboard
20. Self-host images

---

## 🛠️ DEPLOYMENT CHECKLIST

- [ ] Remove hardcoded credentials from code
- [ ] Configure HTTPS with valid SSL certificate
- [ ] Set up Supabase with real database (not localStorage)
- [ ] Configure Mailjet email service
- [ ] Set environment variables (.env.production)
- [ ] Enable CORS restrictions
- [ ] Add Content-Security-Policy headers
- [ ] Set up database backups
- [ ] Configure monitoring/error tracking
- [ ] Load test before launch
- [ ] Security audit by external firm

---

## 📝 CONCLUSION

**Current Status:** 🔴 **NOT PRODUCTION READY**

Mfumo huu una security issues kubwa sana. Inatosha tu kwa:
- ✅ Local development
- ✅ Demo/presentation purposes
- ❌ Production use (DANGEROUS)

**Estimated fix time:** 2-3 weeks kwa security team

---

**Report Generated:** 2026-07-24  
**Auditor:** System Security Expert  
**Next Review:** After fixes implemented
