# Supabase Analytics Database Setup

To enable real cross-device analytics tracking, you need to creating the `page_views` table in your Supabase database.

## 🚀 One-Click Setup (using SQL Editor)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/_/sql)
2. Open the **SQL Editor** (from the left sidebar)
3. Click **New Query**
4. Copy and paste the entire content of the file `supabase_schema.sql` from your project root.
5. Click **Run**

## 📊 What this does

- Creates a table named `page_views`
- Sets up columns for tracking:
  - `page_path`
  - `viewed_at`
  - `referrer`
  - `device_type`
  - `user_agent`
  - `visitor_id` (anonymous)
- Enables **Row Level Security (RLS)** which is critical:
  - **Inserts**: Allowed for everyone (anonymous visitors can be tracked)
  - **Reads**: Allowed ONLY for authenticated users (only you can see the dashboard)

## 🔄 Verify It Works

1. Make sure your `.env.local` is set up with valid credentials
2. Run your app: `npm run dev`
3. Visit the regular pages (`/`) to generate traffic
4. Log in to `/admin` to see the data appearing

**Note**: Data from `localStorage` (previous version) will not be migrated automatically. This starts a fresh, persistent history.
