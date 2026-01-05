'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics-db';

export function AnalyticsTracker({ page }: { page: string }) {
    useEffect(() => {
        // Track page view on mount
        trackPageView(page);
    }, [page]);

    return null; // This component doesn't render anything
}
