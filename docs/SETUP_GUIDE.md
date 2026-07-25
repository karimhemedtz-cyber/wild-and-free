# 🚀 SETUP GUIDE - WISE WARRIOR SAFARIS v2.0

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- npm or yarn
- Supabase account ([free signup](https://supabase.com))
- GitHub account (for version control)

---

## Step 1: Clone Repository

```bash
# Clone your repo
git clone https://github.com/your-username/wise-warrior-safaris.git

# Navigate to project
cd wise-warrior-safaris

# Check Node version
node --version  # Should be 18+
npm --version
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React 19 & TypeScript
- Supabase client
- Rich text editor (Quill)
- DOMPurify (XSS protection)
- All other dependencies

---

## Step 3: Setup Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit with your values
# Use your favorite editor:
nano .env.local
# or
code .env.local
```

Add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get these:**
1. Go to [Supabase Console](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy Project URL and anon public key

---

## Step 4: Setup Database

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Create new project
4. Choose region closest to you
5. Wait for project to be ready (~2 min)

### Run Database Schema

```bash
# Open supabase-schema.sql in your editor
cat supabase-schema.sql
```

1. Go to Supabase Console
2. Go to SQL Editor
3. Click "New Query"
4. Copy entire content of `supabase-schema.sql`
5. Paste into SQL Editor
6. Click "Run"
7. Wait for completion ✅

This creates:
- All necessary tables
- Row-Level Security policies
- Indexes for performance
- Sample data

---

## Step 5: Start Development Server

```bash
npm run dev
```

Output:
```
  VITE v5.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open: `http://localhost:5173`

---

## Step 6: Test Features

### Test Admin Panel

1. Go to `http://localhost:5173/admin`
2. Login with admin credentials (see OTP_SETUP.md)
3. Click "Packages" tab
4. Click "+ Create Package"
5. Fill in:
   - Title: "Test Safari"
   - Description: Type "Visit the" → click [B] → type "Serengeti"
   - Price: 1200
   - Days: 5
6. Click "Save Package"
7. Go to `http://localhost:5173/packages`
8. See your formatted package! ✅

### Test Responsive Design

Press `F12` in browser:
1. Click device toolbar (top-left)
2. Select "iPhone 12"
3. Go to `/packages`
4. Verify looks good on mobile ✅

---

## 🎨 Rich Text Formatting

In AdminPackageForm, use these buttons:

```
[B]     Bold
[I]     Italic  
[U]     Underline
[•]     Bullet list
[1.]    Numbered list
[H1-3]  Headings
[A▼]    Text color
[🔗]    Add link
[🖼️]    Add image
[✕]    Clear formatting
```

All formatted text is stored as HTML in database and displays beautifully on customer website.

---

## 📝 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   └── AdminPackageForm.tsx    # Create packages with formatting
│   ├── display/
│   │   └── PackageCard.tsx         # Display formatted packages
│   ├── RichTextEditor.tsx          # Text editor wrapper
│   ├── AdminDashboard.tsx
│   ├── Header.tsx
│   └── [other components]
├── context/
│   └── AppContext.tsx
├── styles/
│   └── editor.css                  # Rich editor styling
└── lib/
    └── supabaseClient.ts           # Database connection
```

---

## 🐛 Troubleshooting

### "Cannot find module 'quill'"
```bash
npm install quill react-quill dompurify
```

### "Supabase connection failed"
- Check .env.local has correct URL and key
- Verify Supabase project is active
- Check internet connection

### "Database table doesn't exist"
- Make sure you ran supabase-schema.sql
- Check for error messages in SQL Editor
- Run schema again if needed

### "Rich text editor not showing"
- Check `src/styles/editor.css` is imported
- Verify quill packages are installed
- Check browser console for errors

### "Admin login not working"
- See OTP_SETUP.md for credentials
- Check database tables exist
- Verify Supabase credentials in .env.local

---

## 🚀 Build for Production

```bash
# Build optimized version
npm run build

# This creates 'dist' folder with optimized files
```

---

## 🌐 Deploy to Vercel

### Option 1: Via GitHub (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Sign up / Login
4. Click "New Project"
5. Select your GitHub repo
6. Add Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
7. Click "Deploy"
8. Your site is live! 🚀

### Option 2: Manual Upload

```bash
# Build
npm run build

# Upload 'dist' folder to:
# - Netlify
# - Vercel
# - Any static hosting
```

---

## 🔒 Security Checklist

- [ ] Environment variables not committed to Git
- [ ] .env.local in .gitignore
- [ ] Supabase RLS policies enabled
- [ ] Admin credentials changed
- [ ] Database backups configured
- [ ] HTTPS enforced on production
- [ ] Rate limiting enabled
- [ ] Audit logs checked

---

## 📊 Database Backup

### Supabase Backup

1. Go to Supabase Console
2. Settings → Backups
3. Enable automated backups
4. Choose retention period
5. Done! ✅

---

## 🎓 Next Steps

1. ✅ Customize for your business
2. ✅ Add payment integration (Stripe)
3. ✅ Setup email notifications
4. ✅ Add analytics
5. ✅ Deploy to production
6. ✅ Start marketing! 🚀

---

## 📞 Getting Help

- Check `docs/` folder for guides
- Review code comments
- Check Supabase docs
- File issues on GitHub

---

**You're all set! Happy coding! 💪**

Setup
echo "✅ Configuration files created"
