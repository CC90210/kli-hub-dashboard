import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Public routes
                const publicRoutes = [
                    "/login",
                    "/register",
                    "/api/auth",
                    "/_next",
                    "/favicon.ico"
                ]

                const isPublic = publicRoutes.some(route => pathname.startsWith(route))

                if (isPublic) {
                    return true
                }

                // Require token for everything else
                return !!token
            }
        },
        pages: {
            signIn: "/login"
        }
    }
)

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)"
    ]
}
