import { supabase } from '@/lib/supabase';

export interface PageView {
    id: string;
    page_path: string;
    viewed_at: string;
    referrer: string;
    user_agent: string;
    screen_resolution: string;
    language: string;
    timezone: string;
    visitor_id: string;
    device_type: string;
}

// Generate a unique visitor ID (stored in localStorage for persistence across sessions)
export function getVisitorId(): string {
    if (typeof window === 'undefined') return '';

    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
}

// Determine device type from User Agent
export function getDeviceType(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
}

// Track a page view to Supabase
export async function trackPageView(page_path: string) {
    if (typeof window === 'undefined') return;

    const visitor_id = getVisitorId();
    const user_agent = navigator.userAgent;

    const viewData = {
        page_path,
        visitor_id,
        user_agent,
        device_type: getDeviceType(user_agent),
        referrer: document.referrer || 'Direct',
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
        const { error } = await supabase
            .from('page_views')
            .insert([viewData]);

        if (error) {
            console.error('Error tracking page view:', error);
        }
    } catch (err) {
        console.error('Failed to track page view:', err);
    }
}

// FETCH FUNCTIONS (Only work if authenticated)

export async function getAnalyticsSummary(timeFilterHours: number = 24) {
    // Calculate start time based on filter
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - timeFilterHours);
    const startTimeIso = startDate.toISOString();

    // Parallel fetch for dashboard stats
    const [
        totalViewsResult,
        recentViewsResult,
        pagesResult,
        referrersResult
    ] = await Promise.all([
        // 1. Total Views (All time)
        supabase.from('page_views').select('*', { count: 'exact', head: true }),

        // 2. Recent Views (Within time filter)
        supabase.from('page_views')
            .select('*')
            .gte('viewed_at', startTimeIso)
            .order('viewed_at', { ascending: false }),

        // 3. Views Grouped by Page (Within time filter)
        supabase.from('page_views')
            .select('page_path')
            .gte('viewed_at', startTimeIso),

        // 4. Referrers (Within time filter)
        supabase.from('page_views')
            .select('referrer')
            .gte('viewed_at', startTimeIso)
    ]);

    // Process Views by Page
    const viewsByPage: Record<string, number> = {};
    pagesResult.data?.forEach(view => {
        viewsByPage[view.page_path] = (viewsByPage[view.page_path] || 0) + 1;
    });

    // Process Referrers
    const referrerCounts: Record<string, number> = {};
    referrersResult.data?.forEach(view => {
        const ref = view.referrer || 'Direct';
        referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });

    const topReferrers = Object.entries(referrerCounts)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return {
        totalViews: totalViewsResult.count || 0,
        recentViews: recentViewsResult.data || [],
        viewsByPage,
        topReferrers,
    };
}
