import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    return NextResponse.next()
}

export default proxy;

export const config = {
    matcher: '/api/:path*',
}
