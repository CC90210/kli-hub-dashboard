import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password")
                }

                // Find user in database
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase().trim()
                    }
                })

                if (!user) {
                    throw new Error("No account found with this email. Please sign up first.")
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if (!isPasswordValid) {
                    throw new Error("Incorrect password")
                }

                // Return user object (this becomes the session)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },

    pages: {
        signIn: "/login",
        error: "/login"
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.role = user.role
            }

            // Handle session updates (when user updates their profile)
            if (trigger === "update" && session) {
                token.name = session.name
            }

            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.role = token.role as string
            }
            return session
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
}
