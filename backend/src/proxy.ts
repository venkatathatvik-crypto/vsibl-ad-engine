import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Assume we might want to protect /api/campaigns in the future
    // For now, we just pass through.

    // Example logic:
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token && request.nextUrl.pathname.startsWith('/api/protected')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
