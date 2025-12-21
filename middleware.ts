import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/settings/:path*",
        "/api/chat/:path*",
        "/api/documents/:path*",
        "/api/user/:path*",
    ]
}
