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

                // Public routes - no auth needed
                const publicPaths = [
                    "/login",
                    "/signup",
                    "/api/auth",
                    "/_next",
                    "/favicon.ico"
                ]

                const isPublic = publicPaths.some(path => pathname.startsWith(path))

                if (isPublic) {
                    return true
                }

                // All other routes require authentication
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
        /*
         * Match all paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public files
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"
    ]
}
