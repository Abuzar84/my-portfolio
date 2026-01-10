import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script'


import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://abuzarsayyed.vercel.app'),
  title: "Abuzar Wahadatullah Sayyed | Full Stack Developer & PDF Tools",
  description: "Explore the portfolio of Abuzar Wahadatullah Sayyed. Featuring full-stack web applications, native mobile apps, and high-performance PDF editing tools.",
  keywords: ["Full Stack Developer", "Next.js Portfolio", "Android Developer", "PDF Editor Online", "Abuzar Sayyed", "Software Engineer"],
  authors: [{ name: "Abuzar Wahadatullah Sayyed" }],
  openGraph: {
    title: "Abuzar Wahadatullah Sayyed Portfolio",
    description: "Full Stack Developer Portfolio & Free Online PDF Tools",
    url: "https://abuzarsayyed.vercel.app",
    siteName: "Abuzar Sayyed Portfolio",
    images: [
      {
        url: "/pdf-editor-preview.png",
        width: 1200,
        height: 630,
        alt: "Abuzar Sayyed Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Script id="al5sm-tag">
          {`(function(s){s.dataset.zone='10444619',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
      </body>
    </html>
  );
}
