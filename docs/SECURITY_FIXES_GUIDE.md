# 🔧 WISE WARRIOR SAFARIS - SECURITY FIXES GUIDE
**How to fix all 25 issues - Code Examples**

---

## ISSUE #1 & #2: PASSWORD IN USER PROFILE + PLAINTEXT PASSWORD IN OTP

### ❌ CURRENT CODE (AppContext.tsx)
```typescript
// Line 210 - Password in phoneNumber field
const seedAdmin: User = {
  phoneNumber: SEED_ADMIN_PASSWORD,  // ← WRONG!
};

// Line 259 - Password in OTP payload
const passwordPlain = password;
return createAndSendOtp(email, 'register', fullName, supabase, { 
  passwordPlain  // ← WRONG!
});
```

### ✅ FIXED CODE
```typescript
// File: src/context/AppContext.tsx

// 1. Fix seed admin - don't store password in user object
const seedAdmin: User = {
  id: 'admin-seed-' + Math.random().toString(36).substr(2, 9),
  email: SEED_ADMIN_EMAIL,
  fullName: SEED_ADMIN_NAME,
  phoneNumber: '', // ← Empty, password stored separately
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// 2. Fix registration OTP - hash password before storing
const requestRegisterOtp = async (email: string, password: string, fullName: string, phone: string) => {
  const emailLower = email.toLowerCase();
  
  // Validate password strength first
  const validation = validatePassword(password);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Hash password instead of storing plaintext
  const passwordHash = await hashPassword(password);
  
  if (isSupabaseConnected && supabase) {
    try {
      const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
      if (existing) return { success: false, error: 'Email already registered.' };
    } catch {
      // Fall through
    }
  } else {
    const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
    const localUsers: User[] = JSON.parse(storedUsersRaw);
    if (localUsers.find((u) => u.email.toLowerCase() === emailLower)) {
      return { success: false, error: 'Email already registered.' };
    }
  }

  // Store HASHED password in OTP payload, not plaintext
  return createAndSendOtp(email, 'register', fullName, supabase, { 
    email, 
    fullName, 
    phone, 
    passwordHash  // ← Hashed now!
  });
};

// Add password validation function
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*)' };
  }
  return { valid: true };
}

// Fix verification step to use hash
const verifyRegisterOtp = async (email: string, code: string) => {
  const result = await verifyOtp(email, 'register', code);
  if (!result.success) return { success: false, error: result.error };

  const { fullName, phone, passwordHash } = result.payload || {};  // ← Use hash

  if (isSupabaseConnected && supabase) {
    try {
      // If using Supabase auth, let them handle password
      const { data, error } = await supabase.auth.signUp({
        email,
        password: '', // Don't set Supabase password if using their auth
        options: { data: { full_name: fullName, phone_number: phone } },
      });
      // ... rest
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
  const localUsers: User[] = JSON.parse(storedUsersRaw);
  const credsRaw = localStorage.getItem('safari_credentials') || '{}';
  const creds: Record<string, string> = JSON.parse(credsRaw);

  const newUser: User = {
    id: 'usr-' + crypto.getRandomValues(new Uint8Array(8)).reduce((s,b)=>s+b.toString(16),''),
    email,
    fullName: fullName || 'Safari Explorer',
    phoneNumber: phone || '',
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  localUsers.push(newUser);
  // Store hashed password, not plaintext
  creds[email.toLowerCase()] = passwordHash || await hashPassword('');
  localStorage.setItem('safari_users', JSON.stringify(localUsers));
  localStorage.setItem('safari_credentials', JSON.stringify(creds));

  setCurrentUser(newUser);
  localStorage.setItem('safari_current_user', JSON.stringify(newUser));
  return { success: true, user: newUser };
};
```

---

## ISSUE #3: WEAK RANDOM ID GENERATION

### ❌ CURRENT CODE
```typescript
id: 'usr-' + Math.random().toString(36).substr(2, 9)  // ← Predictable!
```

### ✅ FIXED CODE
```typescript
// File: src/lib/utils.ts (new file)
export function generateSecureId(prefix: string = ''): string {
  // Use crypto.getRandomValues for truly random bytes
  const randomBytes = crypto.getRandomValues(new Uint8Array(12));
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  if (prefix) {
    return `${prefix}-${randomHex}`;
  }
  return randomHex;
}

// Usage in AppContext.tsx:
const newUser: User = {
  id: generateSecureId('usr'),  // → "usr-a3f8e2c1b9d4e7f..."
  // ... rest
};

const seedAdmin: User = {
  id: generateSecureId('admin'),  // → "admin-f7e2a8c9b1d4e3f..."
  // ... rest
};
```

---

## ISSUE #4: HARDCODED ADMIN CREDENTIALS

### ❌ CURRENT CODE (AppContext.tsx lines 11-12)
```typescript
const SEED_ADMIN_EMAIL = 'Karimuhemedi@yahoo.com';
const SEED_ADMIN_PASSWORD = '0750916698';
```

### ✅ FIXED CODE
```typescript
// File: src/context/AppContext.tsx

// Load from environment variables instead
const SEED_ADMIN_EMAIL = (import.meta as any).env?.VITE_SEED_ADMIN_EMAIL || '';
const SEED_ADMIN_PASSWORD = (import.meta as any).env?.VITE_SEED_ADMIN_PASSWORD || '';

// File: .env.local (add to .gitignore)
VITE_SEED_ADMIN_EMAIL=admin@wise-warrior.local
VITE_SEED_ADMIN_PASSWORD=SecurePassword123!@#

// File: .gitignore (already should have this)
.env.local
.env.*.local

// Better: Don't seed admin at all - require admin setup
const initializeAdminIfNeeded = async () => {
  const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
  const localUsers: User[] = JSON.parse(storedUsersRaw);
  
  const hasAdmin = localUsers.some(u => u.role === 'admin');
  
  if (!hasAdmin && SEED_ADMIN_EMAIL && SEED_ADMIN_PASSWORD) {
    // Only create if BOTH env vars set AND no admin exists
    // Log warning
    console.warn('⚠️  Creating seeded admin account. Change credentials immediately!');
    // ... create admin
  }
};
```

---

## ISSUE #7: NO RATE LIMITING ON AUTH

### ✅ ADD RATE LIMITING
```typescript
// File: src/lib/rateLimiter.ts (new file)

interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
  lastAttemptTime: number;
  lockedUntil?: number;
}

const RATE_LIMIT_STORAGE_KEY = 'safari_rate_limits';
const ATTEMPTS_WINDOW = 15 * 60 * 1000;  // 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export function checkRateLimit(key: string): { allowed: boolean; remainingAttempts: number } {
  const store = JSON.parse(localStorage.getItem(RATE_LIMIT_STORAGE_KEY) || '{}');
  const record: RateLimitRecord = store[key];
  const now = Date.now();

  // If locked out, check if lockout expired
  if (record?.lockedUntil && now < record.lockedUntil) {
    const minutesRemaining = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, remainingAttempts: 0 };
  }

  // If window expired, reset
  if (!record || now - record.firstAttemptTime > ATTEMPTS_WINDOW) {
    store[key] = {
      attempts: 1,
      firstAttemptTime: now,
      lastAttemptTime: now,
    };
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(store));
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Within window - check attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION;
    store[key] = record;
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(store));
    return { allowed: false, remainingAttempts: 0 };
  }

  // Increment attempt
  record.attempts += 1;
  record.lastAttemptTime = now;
  store[key] = record;
  localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(store));

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.attempts };
}

// Usage in LoginPage.tsx:
import { checkRateLimit } from '../lib/rateLimiter';

const handleSubmitCredentials = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Check rate limit
  const rateLimitKey = `login:${email.toLowerCase()}`;
  const { allowed, remainingAttempts } = checkRateLimit(rateLimitKey);
  
  if (!allowed) {
    setError('Too many login attempts. Please try again in 30 minutes.');
    return;
  }

  if (!email || !password) return;
  setError('');
  setNotice('');
  setLoading(true);

  const res = await requestLoginOtp(email, password);
  setLoading(false);

  if (res.success) {
    // Clear rate limit on success
    localStorage.removeItem(`login:${email.toLowerCase()}`);
    setStep('otp');
    // ...
  } else {
    if (remainingAttempts > 0) {
      setError(`${res.error || 'Authentication failed.'} (${remainingAttempts} attempts remaining)`);
    } else {
      setError('Too many failed attempts. Account locked for 30 minutes.');
    }
  }
};
```

---

## ISSUE #8: WEAK PASSWORD HASHING

### ❌ CURRENT CODE
```typescript
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);  // ← No salt!
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
```

### ✅ FIXED CODE
```typescript
// File: src/lib/passwordHash.ts (new file)

// Option 1: Use argon2 (recommended)
// npm install argon2-browser
import { hash, verify } from 'argon2-browser';

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const result = await hash({
    pass: password,
    salt: salt,
    hashLen: 32,
    time: 2,      // 2 iterations
    mem: 256,     // 256 MB
    parallelism: 1,
    type: 2,      // Argon2id
  });
  
  return result.encoded; // Format: $argon2id$v=19$m=262144,t=2,p=1$...
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const result = await verify({
      pass: password,
      encoded: hash,
    });
    return result.ok;
  } catch {
    return false;
  }
}

// Option 2: Use bcrypt (if argon2 causes issues)
// npm install bcryptjs
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);  // 12 rounds
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage in AppContext.tsx:
const creds: Record<string, string> = JSON.parse(credsRaw);
creds[emailLower] = await hashPassword(password);  // ← Uses bcrypt/argon2
localStorage.setItem('safari_credentials', JSON.stringify(creds));
```

---

## ISSUE #10: NO CSRF PROTECTION

### ✅ ADD CSRF TOKENS
```typescript
// File: src/lib/csrf.ts (new file)

const CSRF_TOKEN_KEY = 'safari_csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

export function generateCsrfToken(): string {
  const token = crypto.getRandomValues(new Uint8Array(32))
    .reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
  
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
}

export function getCsrfToken(): string {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!token) {
    token = generateCsrfToken();
  }
  
  return token;
}

export function verifyCsrfToken(token: string): boolean {
  const stored = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return stored === token && token.length > 0;
}

// File: src/components/BookingModal.tsx
import { getCsrfToken } from '../lib/csrf';

export default function BookingModal({ isOpen, onClose, preSelectedPkgId }: BookingModalProps) {
  const csrfToken = getCsrfToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phoneNumber || !packageId || !travelDate) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    const selectedPkg = packages.find(p => p.id === packageId);
    const packageTitle = selectedPkg ? selectedPkg.title : 'Custom Safari Expedition';

    try {
      await createBooking({
        fullName,
        email,
        phoneNumber,
        packageId,
        packageTitle,
        travelers,
        travelDate,
        message,
        _csrf: csrfToken,  // ← Add CSRF token
      });
      
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('An error occurred during booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... JSX
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="_csrf" value={csrfToken} />
      {/* ... rest of form ... */}
    </form>
  );
}

// Backend validation in AppContext.tsx:
const createBooking = async (booking: any) => {
  // Verify CSRF token matches what was sent
  if (booking._csrf !== sessionStorage.getItem('safari_csrf_token')) {
    return { success: false, error: 'Security verification failed' };
  }

  const { _csrf, ...cleanBooking } = booking;  // Remove token from data
  
  // ... proceed with booking creation
};
```

---

## ISSUE #11: NO INPUT SANITIZATION (XSS)

### ✅ ADD INPUT SANITIZATION
```typescript
// File: src/lib/sanitize.ts (new file)
// npm install dompurify

import DOMPurify from 'dompurify';

export function sanitizeInput(input: string, allowHtml: boolean = false): string {
  if (!allowHtml) {
    // Remove all HTML tags for text fields
    return input.replace(/<[^>]*>/g, '').trim();
  }

  // For rich text, allow safe tags only
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'li'],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return url;
  } catch {
    return '';
  }
}

// File: src/components/BookingModal.tsx
import { sanitizeInput, sanitizeUrl } from '../lib/sanitize';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Sanitize all inputs
  const cleanName = sanitizeInput(fullName);
  const cleanEmail = sanitizeInput(email);
  const cleanPhone = sanitizeInput(phoneNumber);
  
  if (!cleanName || !cleanEmail || !cleanPhone || !packageId || !travelDate) {
    alert('Please fill out all required fields with valid data.');
    return;
  }

  try {
    await createBooking({
      fullName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      packageId,
      packageTitle,
      travelers,
      travelDate,
      message: sanitizeInput(message),
      _csrf: csrfToken,
    });
  } catch (err) {
    console.error(err);
  }
};
```

---

## ISSUE #12: NO AUTHENTICATION ON ADMIN ENDPOINTS

### ✅ ADD ADMIN CHECKS
```typescript
// File: src/components/AdminDashboard.tsx

export default function AdminDashboard({ onBackToHome }: AdminDashboardProps) {
  const { currentUser } = useApp();

  // ✅ Check if user is admin at component level
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access admin dashboard.</p>
      </div>
    );
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  // ✅ Add permission checks on each action
  const handleAddCountry = async (e: React.FormEvent) => {
    // Double-check permission
    if (currentUser?.role !== 'admin') {
      setError('Admin access required');
      return;
    }
    
    // ... rest of function
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    if (currentUser?.role !== 'admin') {
      setError('Admin access required');
      return;
    }
    
    // ... rest
  };

  // Similar for all other admin functions
};

// Create an admin route guard component
interface ProtectedAdminProps {
  children: React.ReactNode;
  onAccessDenied: () => void;
}

export function ProtectedAdminRoute({ children, onAccessDenied }: ProtectedAdminProps) {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'admin') {
    onAccessDenied();
    return null;
  }

  return <>{children}</>;
}

// Usage:
<ProtectedAdminRoute onAccessDenied={() => setActivePage('home')}>
  <AdminDashboard />
</ProtectedAdminRoute>
```

---

## ISSUE #13: NO ADMIN CREATION AUTHENTICATION

### ✅ FIX
```typescript
// File: src/context/AppContext.tsx

const addAdminUser = async (fullName: string, email: string, password: string) => {
  // ✅ Check if caller is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return { success: false, error: 'Admin privileges required' };
  }

  const emailLower = email.toLowerCase();

  // Validate password
  const validation = validatePassword(password);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        await supabase.from('users').insert([
          { id: data.user.id, email, full_name: fullName, role: 'admin' },
        ]);
        const updatedList = [
          ...adminUsersList,
          { 
            id: data.user.id, 
            email, 
            fullName, 
            role: 'admin' as const, 
            createdAt: new Date().toISOString() 
          },
        ];
        setAdminUsersList(updatedList);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Local mode
  const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
  const localUsers: User[] = JSON.parse(storedUsersRaw);
  if (localUsers.find((u) => u.email.toLowerCase() === emailLower)) {
    return { success: false, error: 'A user with that email already exists.' };
  }

  const newAdmin: User = {
    id: generateSecureId('admin'),
    email,
    fullName,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const credsRaw = localStorage.getItem('safari_credentials') || '{}';
  const creds: Record<string, string> = JSON.parse(credsRaw);
  creds[emailLower] = await hashPassword(password);

  localUsers.push(newAdmin);
  localStorage.setItem('safari_users', JSON.stringify(localUsers));
  localStorage.setItem('safari_credentials', JSON.stringify(creds));
  setAdminUsersList(localUsers.filter((u) => u.role === 'admin'));

  return { success: true };
};
```

---

## ISSUE #15: NO SESSION TIMEOUT

### ✅ ADD SESSION TIMEOUT
```typescript
// File: src/lib/sessionTimeout.ts (new file)

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 5 * 60 * 1000;   // Warn 5 min before timeout

export function initializeSessionTimeout(onTimeout: () => void): () => void {
  let timeoutId: NodeJS.Timeout;
  let warningId: NodeJS.Timeout;
  let lastActivityTime = Date.now();

  const resetTimeout = () => {
    lastActivityTime = Date.now();
    
    clearTimeout(timeoutId);
    clearTimeout(warningId);

    // Show warning 5 min before timeout
    warningId = setTimeout(() => {
      console.warn('Session will expire in 5 minutes due to inactivity');
      // Could show a modal here
    }, SESSION_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Auto-logout after timeout
    timeoutId = setTimeout(() => {
      console.warn('Session expired');
      onTimeout();
    }, SESSION_TIMEOUT_MS);
  };

  // Track user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, resetTimeout, true);
  });

  // Initial setup
  resetTimeout();

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    clearTimeout(warningId);
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout, true);
    });
  };
}

// File: src/App.tsx
import { initializeSessionTimeout } from './lib/sessionTimeout';

function AppContent() {
  const { currentUser, signOut } = useApp();

  useEffect(() => {
    if (!currentUser) return;

    const cleanup = initializeSessionTimeout(async () => {
      await signOut();
      setActivePage('login');
      alert('Your session has expired. Please log in again.');
    });

    return cleanup; // Cleanup on unmount or user change
  }, [currentUser]);

  // ... rest of component
}
```

---

## ISSUE #17: BOOKING DATE VALIDATION

### ✅ ADD VALIDATION
```typescript
// File: src/lib/validation.ts

export function validateTravelDate(dateString: string): { valid: boolean; error?: string } {
  try {
    const travelDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Start of today

    if (travelDate < today) {
      return { valid: false, error: 'Travel date must be in the future' };
    }

    // Check if date is within 5 years
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);

    if (travelDate > maxDate) {
      return { valid: false, error: 'Travel date cannot be more than 5 years in advance' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid date format' };
  }
}

export function validateTravelers(count: number): { valid: boolean; error?: string } {
  if (count < 1) {
    return { valid: false, error: 'At least 1 traveler required' };
  }
  if (count > 20) {
    return { valid: false, error: 'Maximum 20 travelers per booking' };
  }
  return { valid: true };
}

// File: src/components/BookingModal.tsx
import { validateTravelDate, validateTravelers } from '../lib/validation';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate all fields
  const dateValidation = validateTravelDate(travelDate);
  if (!dateValidation.valid) {
    setError(dateValidation.error || 'Invalid travel date');
    return;
  }

  const travelersValidation = validateTravelers(travelers);
  if (!travelersValidation.valid) {
    setError(travelersValidation.error || 'Invalid number of travelers');
    return;
  }

  if (!fullName || !email || !phoneNumber || !packageId || !travelDate) {
    alert('Please fill out all required fields.');
    return;
  }

  // ... rest
};
```

---

## ISSUE #19: IMAGE URL VALIDATION

### ✅ ADD IMAGE VALIDATION
```typescript
// File: src/lib/imageValidation.ts

export async function validateImageUrl(url: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Check URL format
    new URL(url);

    // Check file size and type
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: { 'Accept': 'image/*' }
    });

    if (!response.ok) {
      return { valid: false, error: 'Image URL not accessible' };
    }

    const contentType = response.headers.get('content-type') || '';
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!validTypes.some(type => contentType.includes(type))) {
      return { valid: false, error: 'URL is not a valid image' };
    }

    // Check file size
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (contentLength > maxSize) {
      return { valid: false, error: 'Image file is too large (max 5MB)' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid image URL' };
  }
}

// File: src/components/AdminDashboard.tsx
import { validateImageUrl } from '../lib/imageValidation';

const handleAddPackage = async (e: React.FormEvent) => {
  // ... validation ...

  // Validate image URL
  const imgValidation = await validateImageUrl(imageUrl);
  if (!imgValidation.valid) {
    setError(imgValidation.error || 'Invalid package image');
    return;
  }

  // ... proceed with adding package
};
```

---

## ISSUE #20: ITINERARY DAY ORDERING

### ✅ VALIDATE AND SORT
```typescript
// File: src/lib/itineraryValidation.ts

export function validateItinerary(days: Array<{ day: number; title: string; description: string }>): 
  { valid: boolean; error?: string; sorted?: typeof days } {
  
  if (days.length === 0) {
    return { valid: false, error: 'Itinerary must have at least 1 day' };
  }

  // Sort by day number
  const sorted = [...days].sort((a, b) => a.day - b.day);

  // Check for gaps (should be 1, 2, 3, ... n)
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].day !== i + 1) {
      return { 
        valid: false, 
        error: `Days must be sequential. Expected Day ${i + 1}, got Day ${sorted[i].day}` 
      };
    }
  }

  // Check for empty titles/descriptions
  for (const day of sorted) {
    if (!day.title?.trim()) {
      return { valid: false, error: `Day ${day.day} is missing a title` };
    }
    if (!day.description?.trim()) {
      return { valid: false, error: `Day ${day.day} is missing a description` };
    }
  }

  return { valid: true, sorted };
}

// File: src/components/AdminDashboard.tsx
import { validateItinerary } from '../lib/itineraryValidation';

const handleAddPackage = async (e: React.FormEvent) => {
  // ... other validations ...

  const itineraryValidation = validateItinerary(itinerary);
  if (!itineraryValidation.valid) {
    setError(itineraryValidation.error || 'Invalid itinerary');
    return;
  }

  // Use sorted itinerary
  const pkg: Package = {
    id: generateSecureId('pkg'),
    title: sanitizeInput(title),
    description: sanitizeInput(description),
    price: parseFloat(price),
    days: itineraryValidation.sorted?.length || days,
    itinerary: itineraryValidation.sorted || [],  // ← Use sorted
    // ... rest of package
  };

  await addPackage(pkg);
};
```

---

## Summary of npm packages to install:

```bash
# Security
npm install dompurify             # XSS protection
npm install argon2-browser        # Password hashing (or: npm install bcryptjs)
npm install libphonenumber-js    # Phone validation

# Development
npm install --save-dev @types/dompurify
npm install --save-dev @types/libphonenumber-js
```

---

## Testing these fixes:

```bash
# Unit tests for validation
npm install --save-dev vitest

# Create src/__tests__/validation.test.ts
# Create src/__tests__/sanitize.test.ts
# Create src/__tests__/rateLimiter.test.ts
```

---

**Next Step:** Review each fix, test thoroughly, then deploy to staging before production.
