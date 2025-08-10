import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public paths that don't require authentication
const publicPaths = ['/admin/login'];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isAdminPath = path.startsWith('/admin');
    const isPublicPath = publicPaths.includes(path);

    // Skip middleware for non-admin routes
    if (!isAdminPath) {
        return NextResponse.next();
    }

    // For API routes, check the Authorization header
    if (path.startsWith('/api/admin')) {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        // Here you would validate the token
        return NextResponse.next();
    }

    // For regular admin pages
    if (isAdminPath && !isPublicPath) {
        // This is a client-side check, but we need to let it through
        // The layout component will handle the actual redirect
        return NextResponse.next();
    }

    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
    ],
};
