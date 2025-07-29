// components/bottom-navigation.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Bookmark } from 'lucide-react';

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
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full ${pathname === item.path
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                                } transition-colors`}
                        >
                            <div className="mb-1">
                                {item.icon}
                            </div>
                            {/* <span className="text-xs">{item.name}</span> */}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}