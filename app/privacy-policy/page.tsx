'use client';

import { AnalyticsTracker } from '@/components/analytics-tracker';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Lock, Cookie, ExternalLink, Megaphone } from 'lucide-react';


export default function PrivacyPolicy() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
            <AnalyticsTracker page="/privacy-policy" />

            <main className="max-w-3xl mx-auto px-4 py-16 md:py-24">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-600">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-12">

                    {/* Introduction */}
                    <section>
                        <p className="lead text-xl text-gray-600">
                            I believe in complete transparency. This website contains analytics tracking to help me understand how visitors interact with my portfolio. This document explains exactly what is collected, how it is stored, and what it is used for.
                        </p>
                    </section>

                    {/* What We Collect */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Eye className="w-6 h-6" />
                            <h2 className="text-2xl font-bold m-0">What Information Is Collected</h2>
                        </div>

                        <p>
                            When you visit this website, a custom-built analytics system automatically records specific technical details about your visit. I collect <strong>only</strong> the following data points:
                        </p>

                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                            <ul className="space-y-4 m-0 list-none pl-0">
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Page Visited:</span>
                                    <span className="text-gray-600">Which specific page URL you viewed (e.g., /pdf-editor).</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Timestamp:</span>
                                    <span className="text-gray-600">The exact date and time of your visit.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Referrer:</span>
                                    <span className="text-gray-600">The website that linked you here (e.g., Google, Twitter, or Direct).</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Device Type:</span>
                                    <span className="text-gray-600">Whether you are using a Mobile, Tablet, or Desktop device.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Screen Size:</span>
                                    <span className="text-gray-600">Your screen resolution (e.g., 1920x1080) to help check design responsiveness.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Language:</span>
                                    <span className="text-gray-600">Your browser's preferred language setting (e.g., en-US).</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-semibold min-w-[140px]">Timezone:</span>
                                    <span className="text-gray-600">Your local timezone (e.g., Asia/Kolkata).</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Visitor Identification */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-purple-600">
                            <Cookie className="w-6 h-6" />
                            <h2 className="text-2xl font-bold m-0">Visitor Identification (The "Cookie")</h2>
                        </div>

                        <p>
                            To distinguish between a "new visitor" and a "returning visitor," this site saves a single item in your browser's <strong>Local Storage</strong>.
                        </p>

                        <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                            <p className="font-mono text-sm m-0">Key: visitor_id</p>
                            <p className="font-mono text-sm m-0">Example Value: v_1704470000000_xy9z123</p>
                        </div>

                        <p>
                            <strong>Important:</strong> This ID is randomly generated. It does <strong>not</strong> contain your name, email, IP address, or any personal information. It is simply a random tag used to count unique visitors. You can clear this at any time by clearing your browser's cache/storage.
                        </p>
                    </section>

                    {/* Advertising & Monetization */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <Megaphone className="w-6 h-6" />
                            <h2 className="text-2xl font-bold m-0">Advertising & Monetization</h2>
                        </div>

                        <p>
                            To keep this portfolio and its tools (like the PDF Editor) free to use, I display advertisements provided by <strong>Monetag</strong>.
                        </p>

                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                            <p className="font-semibold mb-2">How Monetag Manages Data:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Ad Delivery:</strong> Monetag uses your technical information (like device type, browser, and general location/IP) to deliver relevant ads.</li>
                                <li><strong>Cookies:</strong> They may use cookies or similar technologies to prevent you from seeing the same ad repeatedly and to measure ad performance.</li>
                                <li><strong>Anonymity:</strong> Monetag focuses on behavioral patterns and technical data rather than your personal identity.</li>
                            </ul>
                        </div>

                        <p>
                            You can learn more about how Monetag handles your data and your rights to opt-out by visiting their official documentation:
                        </p>

                        <a
                            href="https://monetag.com/privacy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:underline font-medium"
                        >
                            Read Monetag's Privacy Policy <ExternalLink className="w-4 h-4" />
                        </a>
                    </section>

                    {/* Data Storage */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-green-600">
                            <Database className="w-6 h-6" />
                            <h2 className="text-2xl font-bold m-0">How Data Is Stored</h2>
                        </div>

                        <p>
                            The analytics data is stored in a <strong>Supabase</strong> database.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Access to the data is restricted.</li>
                            <li>Only I (the site administrator) can view the aggregated dashboard.</li>
                            <li>The database is protected by <strong>Row Level Security (RLS)</strong>:
                                <ul className="list-circle pl-5 mt-2">
                                    <li>Public users (you) have "Insert Only" permission (to record a view).</li>
                                    <li>Only Authenticated Admins (me) have "Read" permission (to see the stats).</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    {/* Purpose */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-orange-600">
                            <Shield className="w-6 h-6" />
                            <h2 className="text-2xl font-bold m-0">Why Wait? No IP Address?</h2>
                        </div>

                        <p>
                            Most analytics tools collect your IP address to pinpoint your exact location. <strong>I do not collect IP addresses.</strong>
                        </p>
                        <p>
                            I respect your privacy. I am interested in <em>"How many people visited from India?"</em> (Timezone), not <em>"Who specifically visited from this street address?"</em> (IP Address).
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Contact</h2>
                        <p className="text-gray-600">
                            If you have any questions about this policy or the data collected, please feel free to contact me via the social links on the home page.
                        </p>
                    </section>

                </div>
            </main>
        </div>
    );
}
