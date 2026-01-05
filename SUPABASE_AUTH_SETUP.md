# Supabase Authentication Setup Guide

## 🎯 Overview
Your admin dashboard now uses **Supabase Authentication** with email and password login instead of a simple password. This provides secure, production-ready authentication.

## 📋 Prerequisites
- A Supabase account (free tier available)
- Your portfolio project

## 🚀 Setup Steps

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: my-portfolio (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (1-2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the sidebar
2. Go to **API** section
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

### 3. Configure Environment Variables

1. Create a file named `.env.local` in your project root:
   ```
   c:\my-portfolio\.env.local
   ```

2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Replace** `your-project-id` and `your-anon-key-here` with your actual values from step 2.

3. Save the file

### 4. Create an Admin User

You need to create at least one admin user account in Supabase:

#### Option A: Using Supabase Dashboard (Recommended)

1. In your Supabase project, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: your-admin-email@example.com
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**

#### Option B: Using Sign-Up API (Advanced)

You can also create a sign-up page or use the Supabase API directly. For now, using the dashboard is easiest.

### 5. Restart Your Development Server

1. Stop the current dev server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 6. Test the Login

1. Navigate to `http://localhost:3000/admin`
2. You should see the new login form with email and password fields
3. Enter the credentials you created in step 4
4. Click "Sign In"
5. You should be logged in and see the analytics dashboard!

## 🔐 Security Features

### What's Included:
- ✅ **Secure Authentication**: Industry-standard JWT tokens
- ✅ **Password Hashing**: Passwords are never stored in plain text
- ✅ **Session Management**: Automatic token refresh
- ✅ **Email Verification**: Can be enabled in Supabase settings
- ✅ **Password Reset**: Built into Supabase (can add UI later)
- ✅ **Logout Functionality**: Secure session termination

### Additional Security (Optional):

#### Enable Email Confirmation
1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Confirm email**
3. Users will need to verify their email before logging in

#### Enable Row Level Security (RLS)
If you plan to store analytics data in Supabase database:
1. Create tables for analytics
2. Enable RLS policies to restrict access to authenticated users only

## 📝 Environment Variables Reference

Create `.env.local` with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- The anon key is safe to expose in the browser (it's public)

## 🎨 New Features

### Login Page
- Email input field with icon
- Password input field with icon
- Error messages for failed login attempts
- Loading state during authentication
- "Back to Home" link

### Dashboard Header
- Shows logged-in user's email
- Logout button
- Clear Data button

### Authentication Flow
1. User visits `/admin`
2. If not logged in → Shows login form
3. User enters email and password
4. Supabase validates credentials
5. On success → User sees dashboard
6. Session persists across page reloads
7. User can logout anytime

## 🔧 Troubleshooting

### "Invalid login credentials"
- Double-check email and password
- Ensure user was created in Supabase
- Verify user is confirmed (Auto Confirm User was checked)

### "Failed to fetch"
- Check your `.env.local` file exists
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Restart dev server after adding env variables

### "Loading..." stuck forever
- Check browser console for errors
- Verify Supabase project is active
- Check network tab for failed requests

### Environment variables not working
- Ensure file is named `.env.local` (not `.env`)
- Restart dev server after creating/editing `.env.local`
- Variables must start with `NEXT_PUBLIC_` to work in browser

## 📚 Next Steps

### Recommended Enhancements:

1. **Password Reset Flow**
   - Add "Forgot Password?" link
   - Implement password reset page
   - Use Supabase's built-in reset functionality

2. **Email Verification**
   - Enable email confirmation in Supabase
   - Add verification page
   - Show verification status

3. **Multiple Admin Users**
   - Create additional admin accounts
   - Add user management page
   - Implement role-based access

4. **Store Analytics in Supabase**
   - Create analytics tables
   - Save page views to database
   - Enable cross-device analytics viewing

5. **Two-Factor Authentication**
   - Enable 2FA in Supabase settings
   - Add 2FA setup page
   - Enhance security further

## 📖 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## ✅ Checklist

Before deploying to production:

- [ ] Created Supabase project
- [ ] Added environment variables to `.env.local`
- [ ] Created at least one admin user
- [ ] Tested login functionality
- [ ] Tested logout functionality
- [ ] Enabled email confirmation (optional)
- [ ] Set up password reset flow (optional)
- [ ] Added environment variables to hosting platform (Vercel, Netlify, etc.)

## 🚀 Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Use the same variable names:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy your application
4. Test login on production URL

---

**Need Help?** Check the Supabase documentation or reach out to their support team.
