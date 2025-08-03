// /home/muktar/code/deris-project/ders-app/components/admin/sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BookOpen, User, X, Menu, FileAudio, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Ustadhs', href: '/admin/ustadhs', icon: User },
    { name: 'Ders', href: '/admin/ders', icon: BookOpen },
    { name: 'Audio Parts', href: '/admin/audio-part', icon: FileAudio },
    { name: 'Quizzes', href: '/admin/quiz', icon: BookOpen },
    { name: 'Quiz Questions', href: '/admin/quiz-question', icon: BookOpen },
    { name: 'Categories', href: '/admin/category', icon: BookOpen },
];

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    onClose: () => void;
    toggleSidebar: () => void;
}

export function Sidebar({ isOpen, isMobile, onClose, toggleSidebar }: SidebarProps) {
    const pathname = usePathname();

    // Don't render anything on server-side to prevent hydration issues
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 h-full bg-card border-r border-border',
                    'transition-all duration-300 ease-in-out transform',
                    'flex flex-col',
                    isMobile ? 'w-64' : 'w-20',
                    !isMobile && isOpen && 'w-64',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    !isMobile && 'lg:translate-x-0',
                )}
                aria-label="Sidebar"
            >
                <div className="flex h-full flex-col">
                    {/* Sidebar header */}
                    <div className="flex h-16 items-center justify-between border-b border-border px-4">
                        {isOpen && (
                            <h1 className="text-xl font-bold whitespace-nowrap">
                                Admin Panel
                            </h1>
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleSidebar}
                                className={cn(
                                    'p-1.5 rounded-md hover:bg-accent',
                                    'text-muted-foreground hover:text-foreground',
                                    'transition-colors',
                                    isMobile && 'hidden'
                                )}
                                aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                            >
                                {isOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                            {isMobile && (
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-md hover:bg-accent lg:hidden"
                                    aria-label="Close sidebar"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        'flex items-center p-3 rounded-md text-sm font-medium',
                                        'transition-colors mb-1',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                                        !isOpen && 'justify-center',
                                        isActive && !isOpen && 'bg-primary/90'
                                    )}
                                    title={!isOpen ? item.name : undefined}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {isOpen && (
                                        <span className="ml-3 whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}