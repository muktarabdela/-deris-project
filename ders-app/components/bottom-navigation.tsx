// components/bottom-navigation.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'መነሻ ገፅ',
            path: '/dashboard',
            icon: <Home className="w-5 h-5" />
        },
        {
            name: 'ቀዳሚዎች',
            path: '/leaderboard',
            icon: <Trophy className="w-5 h-5" />
        },
        {
            name: 'ተቀመጡ የተቀመጡ',
            path: '/saved',
            icon: <Bookmark className="w-5 h-5" />
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
            <div className="max-w-md mx-auto px-4">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    'flex items-center p-3 rounded-md text-sm font-medium',
                                    'transition-colors mb-1',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                                    isActive && 'bg-primary/90'
                                )}

                            >
                                {item.icon}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}