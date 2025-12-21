// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Just pass through - let pages handle their own auth
    return NextResponse.next()
}

export const config = {
    matcher: [] // Match nothing - effectively disabled
}
