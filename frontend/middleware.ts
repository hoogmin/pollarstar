import { NextRequest, NextResponse } from "next/server"

// List of routes to protect from authenticated users.
const protectedAlreadyAuthRoutes = ["/login", "/register"]
const protectedRequireAuthRoutes = ["/settings"]

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    const token = req.cookies.get("refreshToken")

    // Protect routes that can't be visited once authenticated.
    if (token && protectedAlreadyAuthRoutes.includes(url.pathname)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Protect routes that require authentication.
    if (!token && protectedRequireAuthRoutes.includes(url.pathname)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Only apply this middleware to these paths.
export const config = {
    matcher: ["/login", "/register", "/settings"]
}