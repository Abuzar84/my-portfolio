'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Eye,
    Users,
    Globe,
    Clock,
    TrendingUp,
    Monitor,
    Smartphone,
    Tablet,
    ExternalLink,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Mail,
    Lock,
    LogOut
} from 'lucide-react';
import {
    getAnalyticsSummary,
    type PageView
} from '@/lib/analytics-db';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function AdminPage() {
    // Analytics State
    const [totalViews, setTotalViews] = useState(0);
    const [viewsByPage, setViewsByPage] = useState<Record<string, number>>({});
    const [recentViews, setRecentViews] = useState<PageView[]>([]);
    const [topReferrers, setTopReferrers] = useState<Array<{ referrer: string; count: number }>>([]);
    const [timeFilter, setTimeFilter] = useState<number>(24);

    // Supabase auth state
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load analytics when authenticated
    useEffect(() => {
        if (user) {
            loadAnalytics();
        }
    }, [user, timeFilter]);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        try {
            const data = await getAnalyticsSummary(timeFilter);
            setTotalViews(data.totalViews);
            setViewsByPage(data.viewsByPage);
            setRecentViews(data.recentViews);
            setTopReferrers(data.topReferrers);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setUser(data.user);
        } catch (error: any) {
            setError(error.message || 'Failed to login. Please check your credentials.');
            console.error('Login error:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDeviceIcon = (type: string) => {
        if (type === 'Mobile') return <Smartphone className="w-4 h-4" />;
        if (type === 'Tablet') return <Tablet className="w-4 h-4" />;
        return <Monitor className="w-4 h-4" />;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 animate-pulse">
                        <Activity className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Login screen
    if (!user) {
        return (
            <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                            <Activity className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Sign in to access analytics</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Dashboard
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <Activity className="w-6 h-6 text-indigo-600" />
                                    Analytics Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Welcome, {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Time Filter */}
                <div className="flex gap-2">
                    {[
                        { label: 'Last 24h', value: 24 },
                        { label: 'Last 7d', value: 168 },
                        { label: 'Last 30d', value: 720 },
                        { label: 'All Time', value: 999999 },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setTimeFilter(filter.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeFilter === filter.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-indigo-100">
                                <Eye className="w-6 h-6 text-indigo-600" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
                        <p className="text-3xl font-bold mt-2">{totalViews}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-purple-100">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Recent Views</h3>
                        <p className="text-3xl font-bold mt-2">{recentViews.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-green-100">
                                <Globe className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Pages Tracked</h3>
                        <p className="text-3xl font-bold mt-2">{Object.keys(viewsByPage).length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-orange-100">
                                <ExternalLink className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Top Referrers</h3>
                        <p className="text-3xl font-bold mt-2">{topReferrers.length}</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Views by Page */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-bold">Views by Page</h2>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(viewsByPage).length > 0 ? (
                                Object.entries(viewsByPage)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([page, count]) => {
                                        const maxCount = Math.max(...Object.values(viewsByPage));
                                        const percentage = (count / maxCount) * 100;

                                        return (
                                            <div key={page} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium truncate">{page}</span>
                                                    <span className="text-gray-600">{count} views</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <p className="text-gray-500 text-center py-8">No data available</p>
                            )}
                        </div>
                    </div>

                    {/* Top Referrers */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold">Top Referrers</h2>
                        </div>
                        <div className="space-y-3">
                            {topReferrers.length > 0 ? (
                                topReferrers.map((ref, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                {idx + 1}
                                            </div>
                                            <span className="truncate text-sm">{ref.referrer}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600 ml-2">
                                            {ref.count}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No referrer data</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-bold">Recent Activity</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Page</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Referrer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Device</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentViews.length > 0 ? (
                                    recentViews
                                        .slice(0, 20)
                                        .map((view, idx) => (
                                            <tr
                                                key={view.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(view.viewed_at)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium">{view.page_path}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs">
                                                    {view.referrer}
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {getDeviceIcon(view.device_type)}
                                                        <span>{view.device_type}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {view.timezone}
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500">
                                            No recent activity
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
