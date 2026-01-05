# Admin Analytics Dashboard

## Overview
This admin dashboard provides comprehensive analytics for your portfolio website, tracking page views and visitor information anonymously.

## Features

### 📊 Analytics Tracking
- **Anonymous Tracking**: No personal data or IP addresses collected
- **Page Views**: Track which pages are visited and how often
- **Referrer Tracking**: See where your visitors are coming from
- **Device Detection**: Identify whether visitors use desktop, tablet, or mobile
- **Time-based Filtering**: View analytics for last 24h, 7 days, 30 days, or all time
- **Browser Information**: Track screen resolution, language, and timezone

### 🔒 Security
- Password protected admin panel
- Default password: `admin123` (⚠️ **IMPORTANT**: Change this in production!)

## How to Access

1. **Navigate to Admin Page**
   - Visit: `http://localhost:3000/admin`
   - Or add `/admin` to your deployed URL

2. **Login**
   - Enter the admin password (default: `admin123`)
   - Click "Access Dashboard"

3. **View Analytics**
   - See total views, recent views, pages tracked, and top referrers
   - Filter by time period (24h, 7d, 30d, all time)
   - View detailed visitor information in the activity table

## Dashboard Sections

### 📈 Stats Cards
- **Total Views**: All-time page view count
- **Recent Views**: Views within selected time period
- **Pages Tracked**: Number of unique pages visited
- **Top Referrers**: Number of unique referrer sources

### 📊 Charts
- **Views by Page**: Bar chart showing which pages are most popular
- **Top Referrers**: List of top traffic sources

### 🕐 Recent Activity Table
Displays detailed information for each page view:
- **Time**: When the page was visited
- **Page**: Which page was visited
- **Referrer**: Where the visitor came from
- **Device**: Desktop, tablet, or mobile
- **Location**: Visitor's timezone

## Data Storage

Analytics data is stored in the browser's `localStorage`:
- **Key**: `analytics_views`
- **Limit**: Last 1000 views (to prevent storage overflow)
- **Persistence**: Data persists across browser sessions
- **Privacy**: All data is stored locally, no server-side tracking

## Changing the Admin Password

To change the admin password, edit the file:
```
c:\my-portfolio\app\admin\page.tsx
```

Find this line (around line 27):
```typescript
const ADMIN_PASSWORD = 'admin123'; // Change this!
```

Replace `'admin123'` with your desired password.

⚠️ **Note**: This is a simple client-side password protection. For production use, implement proper server-side authentication.

## Clearing Analytics Data

To clear all analytics data:
1. Login to the admin dashboard
2. Click the "Clear Data" button in the top-right
3. Confirm the action

This will permanently delete all tracked analytics data.

## Tracked Pages

Currently tracking:
- `/` - Home page
- `/pdf-editor` - PDF Editor page

To add tracking to additional pages:
1. Import the tracker: `import { AnalyticsTracker } from '@/components/analytics-tracker';`
2. Add the component: `<AnalyticsTracker page="/your-page-path" />`

## Privacy Considerations

This analytics system is designed with privacy in mind:
- ✅ No cookies used
- ✅ No IP addresses collected
- ✅ No personal information stored
- ✅ All data stored locally in browser
- ✅ Anonymous visitor tracking
- ✅ GDPR-friendly approach

## Future Enhancements

Consider adding:
- Server-side analytics with Supabase
- Export analytics data to CSV
- More detailed charts and visualizations
- Real-time analytics updates
- Visitor session tracking
- Conversion tracking
- A/B testing capabilities

## Troubleshooting

### "No data available"
- Make sure you've visited some pages on your site first
- Check that JavaScript is enabled
- Verify localStorage is not disabled

### Can't access admin page
- Ensure the dev server is running (`npm run dev`)
- Check the URL is correct (`/admin`)
- Try clearing browser cache

### Password not working
- Verify you're using the correct password
- Check for typos (case-sensitive)
- Review the password in `app/admin/page.tsx`

## Technical Details

### Files Created
- `lib/analytics.ts` - Analytics utility functions
- `components/analytics-tracker.tsx` - Client component for tracking
- `app/admin/page.tsx` - Admin dashboard page

### Dependencies
All features use built-in Next.js and React functionality:
- No additional npm packages required
- Uses localStorage API
- Client-side only tracking
