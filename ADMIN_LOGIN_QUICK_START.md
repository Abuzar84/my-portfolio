# 🔐 Admin Login - Quick Reference

## Login Credentials Setup

### Step 1: Add Environment Variables
Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Create Admin User in Supabase
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Navigate to: **Authentication** → **Users**
4. Click **Add user** → **Create new user**
5. Enter email and password
6. ✅ Check "Auto Confirm User"
7. Click **Create user**

### Step 3: Login
- URL: `http://localhost:3000/admin`
- Use the email and password you created

---

## Quick Commands

```bash
# Restart dev server (after adding .env.local)
npm run dev

# Or with pnpm
pnpm dev
```

---

## Files Created/Modified

✅ `lib/supabase.ts` - Supabase client configuration
✅ `app/admin/page.tsx` - Updated with email/password auth
✅ `env.example` - Environment variables template
✅ `SUPABASE_AUTH_SETUP.md` - Full setup guide

---

## Need Help?

See `SUPABASE_AUTH_SETUP.md` for detailed instructions.
