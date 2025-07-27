import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppContent } from "./app-content";
import { ProfileButton } from "@/components/profile-button";
import { AuthProvider } from "@/context/authContext";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{
          WebkitTextSizeAdjust: '100%',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <ThemeProvider>
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
              <AuthProvider>
                {children}
              </AuthProvider>
            </AppContent>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
