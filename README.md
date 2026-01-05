# Abuzar Wahadatullah Sayyed - Full Stack Developer Portfolio

This is the personal portfolio website for **Abuzar Wahadatullah Sayyed**, a Full Stack Developer specializing in modern web technologies and mobile application development.

## 🚀 Features

-   **Modern Tech Stack**: Built with Next.js 15, React 19, and Tailwind CSS v4.
-   **Dark & Light Mode**: Fully themed environment with a toggle switch, respecting system preferences.
-   **Responsive Design**: Optimized for all devices, from mobile phones to large desktops.
-   **Premium Aesthetics**: Features smooth gradients, glassmorphism, and custom entry animations used throughout the site.
-   **SEO Optimized**: Proper metadata and structure for search engine visibility.
-   **Admin Analytics Dashboard**: Track page views, visitor analytics, and referrer data with beautiful visualizations.
-   **Supabase Authentication**: Secure email/password login for admin access.
-   **PDF Editor**: Integrated PDF viewing and editing capabilities.

## 🛠️ Technologies Used

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
-   **Authentication**: [Supabase](https://supabase.com/)
-   **PDF Processing**: [react-pdf](https://github.com/wojtekmaj/react-pdf)
-   **Deployment**: Vercel (Recommended)

## 📂 Project Structure

```bash
├── app/
│   ├── admin/
│   │   └── page.tsx         # Admin analytics dashboard with Supabase auth
│   ├── pdf-editor/
│   │   └── page.tsx         # PDF editor page
│   ├── privacy-policy/
│   │   └── page.tsx         # Privacy policy page
│   ├── globals.css          # Global styles, Tailwind setup, and custom animations
│   ├── layout.tsx           # Root layout including ThemeProvider
│   └── page.tsx             # Main landing page (Hero, Skills, Footer)
├── components/
│   ├── analytics-tracker.tsx  # Analytics tracking component
│   ├── social-icons.tsx       # Social media icon components
│   ├── theme-provider.tsx     # Context provider for light/dark mode
│   └── theme-toggle.tsx       # Theme switcher component
├── lib/
│   ├── analytics.ts           # Analytics utility functions
│   └── supabase.ts            # Supabase client configuration
└── public/                    # Static assets
```

## 🔐 Admin Dashboard

This portfolio includes a powerful admin analytics dashboard:

- **URL**: `/admin`
- **Authentication**: Supabase email/password
- **Features**:
  - Page view tracking
  - Visitor analytics (device, location, referrer)
  - Time-based filtering (24h, 7d, 30d, all time)
  - Beautiful data visualizations
  - Export and clear data options

### Setup Instructions

1. **Authentication**: See [`SUPABASE_AUTH_SETUP.md`](./SUPABASE_AUTH_SETUP.md)
2. **Database**: See [`SUPABASE_ANALYTICS_SETUP.md`](./SUPABASE_ANALYTICS_SETUP.md)
3. **Quick Start**: See [`ADMIN_LOGIN_QUICK_START.md`](./ADMIN_LOGIN_QUICK_START.md)

## ⚡ Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/my-portfolio.git
    cd my-portfolio
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    # or
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the site.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

© 2026 Abuzar Wahadatullah Sayyed. All rights reserved.
