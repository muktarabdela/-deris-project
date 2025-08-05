"use client";

import { usePathname } from 'next/navigation';
import { BottomNavigation } from '@/components/bottom-navigation';

// List of routes where bottom navigation should be shown
const NAVIGATION_ROUTES = [
    '/dashboard',
    '/leaderboard',
    '/bookmark',
    '/ders',
    '/all-ders',
    '/profile',
    // Add other routes where bottom navigation should appear
];

export function AppContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if the current path starts with any of the navigation routes
    const showBottomNav = NAVIGATION_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    return (
        <>
            <main className={`p-4 ${showBottomNav ? 'pb-24' : 'pb-4'}`}>
                {children}
            </main>
            {showBottomNav && <BottomNavigation />}
        </>
    );
}
