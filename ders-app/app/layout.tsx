import type { Metadata } from "next";
import { Noto_Sans_Ethiopic } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/hooks/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileButton } from "@/components/profile-button";
import { AuthProvider } from "@/context/authContext";
import { AppContent } from "@/components/app-content";
import { ConditionalLayoutWrapper } from "@/components/conditional-layout-wrapper";

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

const noto = Noto_Sans_Ethiopic({
    subsets: ['ethiopic'],
    weight: ['400', '700']
});

export const metadata: Metadata = {
    title: "Deris App",
    description: "Your Islamic learning journey starts here",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </head>
            <body
                className={`${noto.className} antialiased bg-background text-foreground`}
                style={{
                    WebkitTextSizeAdjust: '100%',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                }}
            >
                <ThemeProvider>
                    <ConditionalLayoutWrapper>
                        {children}
                    </ConditionalLayoutWrapper>
                </ThemeProvider>
            </body>
        </html>
    );
}
