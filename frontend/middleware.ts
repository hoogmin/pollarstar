import { NextRequest, NextResponse } from "next/server"

// List of routes to protect from authenticated users.
const protectedRoutes = ["/login", "/register"]

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    const token = req.cookies.get("refreshToken")

    if (token && protectedRoutes.includes(url.pathname)) {
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Only apply this middleware to these paths.
export const config = {
    matcher: ["/login", "/register"]
}