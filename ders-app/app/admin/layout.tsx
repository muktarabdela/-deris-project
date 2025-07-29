"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileButton } from "@/components/profile-button";
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Check if mobile on mount and on resize
    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);

            // On desktop, always show the sidebar
            if (!mobile) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [pathname, isMobile]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => isMobile && setIsSidebarOpen(false)}
                isMobile={isMobile}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background",
                !isMobile && isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
            )}>
                {/* Header */}
                <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-md hover:bg-accent mr-2 lg:hidden"
                                aria-label="Toggle sidebar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <ProfileButton />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}