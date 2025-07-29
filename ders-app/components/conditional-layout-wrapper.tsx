// /home/muktar/code/deris-project/ders-app/components/conditional-layout-wrapper.tsx
"use client";

import { usePathname } from 'next/navigation';
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileButton } from "@/components/profile-button";
import { AppContent } from "@/components/app-content";

export function ConditionalLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    // If it's an admin route, render children directly without any mobile wrapper.
    // The admin layout (/admin/layout.tsx) will then take full control.
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Otherwise, render the standard mobile-first layout.
    return (
        <div className="relative max-w-md mx-auto h-screen overflow-y-auto bg-background">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b border-border">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Deris</h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <ProfileButton />
                    </div>
                </div>
            </div>
            <AppContent>
                {children}
            </AppContent>
        </div>
    );
}