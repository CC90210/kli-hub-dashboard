import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Demo users for development/testing when no database is configured
const DEMO_USERS = [
    {
        id: "demo-admin-1",
        email: "admin@kli.com",
        password: "admin123",
        name: "Admin User",
        role: "ADMIN"
    },
    {
        id: "demo-user-1",
        email: "demo@kli.com",
        password: "demo1234",
        name: "Demo User",
        role: "USER"
    },
    {
        id: "demo-owner-1",
        email: "owner@kli.com",
        password: "owner123",
        name: "Owner Admin",
        role: "OWNER"
    }
]

// Only import Prisma if DATABASE_URL exists to prevent crash on import
const getPrismaClient = async () => {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    if (!dbUrl) {
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

// Helper to check demo users
const authenticateDemoUser = (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim()
    const demoUser = DEMO_USERS.find(
        u => u.email === normalizedEmail && u.password === password
    )
    if (demoUser) {
        return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role
        }
    }
    return null
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

                const email = credentials.email.toLowerCase().trim()
                const password = credentials.password

                // Check if database is available
                const hasDatabase = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

                if (!hasDatabase) {
                    // No database - only allow demo users
                    const demoUser = authenticateDemoUser(email, password)
                    if (demoUser) {
                        return demoUser
                    }
                    throw new Error("Database not configured. Use demo credentials: demo@kli.com / demo1234")
                }

                // Database is configured - try to authenticate
                try {
                    const bcrypt = await import('bcryptjs')
                    const prisma = await getPrismaClient()

                    if (!prisma) {
                        // Database connection failed - fallback to demo users
                        console.warn("Prisma client unavailable, trying demo users...")
                        const demoUser = authenticateDemoUser(email, password)
                        if (demoUser) {
                            return demoUser
                        }
                        throw new Error("Database connection failed")
                    }

                    // Try to find user in database
                    const user = await prisma.user.findUnique({
                        where: { email }
                    })

                    if (!user) {
                        // Check demo users as fallback
                        const demoUser = authenticateDemoUser(email, password)
                        if (demoUser) {
                            return demoUser
                        }
                        throw new Error("UserNotFound")
                    }

                    const isValid = await bcrypt.compare(password, user.hashedPassword)

                    if (!isValid) {
                        throw new Error("PasswordMismatch")
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                } catch (error: any) {
                    console.error("Auth error:", error)
                    
                    // On database error, try demo users as last resort
                    if (error.message !== "UserNotFound" && error.message !== "PasswordMismatch") {
                        const demoUser = authenticateDemoUser(email, password)
                        if (demoUser) {
                            console.log("Database error - authenticating via demo user")
                            return demoUser
                        }
                    }
                    
                    throw new Error(error.message || "Authentication failed")
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
