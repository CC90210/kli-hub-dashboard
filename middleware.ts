import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/",
        "/chat/:path*",
        "/documents/:path*",
        "/settings/:path*",
        "/api/chat/:path*", // Protect API routes too
        "/api/documents/:path*"
    ]
}
