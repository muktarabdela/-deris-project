"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminData, setAdminData] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            if (pathname === '/admin/login') {
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('adminToken');
            const admin = localStorage.getItem('adminData');

            if (!token || !admin) {
                router.push('/admin/login');
                return;
            }

            try {
                setAdminData(JSON.parse(admin));
            } catch (error) {
                console.error('Error parsing admin data:', error);
                handleLogout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);

            if (!mobile) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        checkIfMobile();

        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [pathname, isMobile]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        router.push('/admin/login');
        window.location.reload();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Only show sidebar when authenticated */}
            {adminData && (
                <>
                    <div
                        className={cn(
                            'fixed inset-y-0 left-0 z-40 w-64 bg-card text-card-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0',
                            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                            'border-r border-border'
                        )}
                    >
                        <Sidebar
                            onClose={() => isMobile && setIsSidebarOpen(false)}
                            isMobile={isMobile}
                            toggleSidebar={toggleSidebar}
                            isOpen={isSidebarOpen}
                        />
                    </div>

                    {/* Overlay for mobile */}
                    {isSidebarOpen && isMobile && (
                        <div
                            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </>
            )}

            {/* Main content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${adminData ? 'lg:pl-64' : ''}`}>
                {/* Top navigation - Only show when authenticated */}
                {adminData && (
                    <header className="bg-card border-b border-border h-16 flex items-center sticky top-0 z-10">
                        <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8">
                            <button
                                type="button"
                                className="lg:hidden text-foreground/70 hover:text-foreground transition-colors"
                                onClick={toggleSidebar}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>

                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                {adminData && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-foreground/80">
                                            {adminData.user_name}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}