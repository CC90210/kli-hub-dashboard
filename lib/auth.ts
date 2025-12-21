import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Only import Prisma if DATABASE_URL exists to prevent crash on import
const getPrismaClient = async () => {
    if (!process.env.DATABASE_URL) {
        return null
    }
    // Dynamic import to avoid build-time errors if module is missing
    try {
        const { PrismaClient } = await import('@prisma/client')
        return new PrismaClient()
    } catch (e) {
        console.error("Failed to import PrismaClient", e)
        return null
    }
}

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
                    throw new Error("Email and password required")
                }

                // Check if database is available
                if (!process.env.DATABASE_URL) {
                    // TEMPORARY: Allow a test user when no database
                    if (credentials.email === "admin@kli.com" && credentials.password === "admin123") {
                        return {
                            id: "1",
                            email: "admin@kli.com",
                            name: "Admin User",
                            role: "ADMIN"
                        }
                    }
                    throw new Error("Database not configured. Please contact administrator.")
                }

                try {
                    const bcrypt = await import('bcryptjs')
                    const prisma = await getPrismaClient()

                    if (!prisma) {
                        throw new Error("Database connection failed")
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email.toLowerCase().trim() }
                    })

                    if (!user) {
                        throw new Error("No account found with this email")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)

                    if (!isValid) {
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                } catch (error: any) {
                    console.error("Auth error:", error)
                    throw new Error(error.message || "Authentication failed")
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.name = user.name
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
                session.user.role = token.role as string
                session.user.name = token.name as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build-only",
    debug: process.env.NODE_ENV === "development"
}
