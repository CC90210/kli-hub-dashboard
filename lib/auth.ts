import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                // ---------------------------------------------------------------
                // DEMO BYPASS: Allow specific credentials
                // ---------------------------------------------------------------
                const isDemoUser = credentials.email === "demo@kli.com" && credentials.password === "demo123";

                if (isDemoUser) {
                    return {
                        id: "demo-user-id",
                        email: "demo@kli.com",
                        name: "Demo User",
                        role: "ADMIN"
                    }
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    })

                    if (!user || !user.hashedPassword) {
                        throw new Error("User not found")
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.hashedPassword
                    )

                    if (!isValid) {
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                } catch (error) {
                    console.error("Auth Error:", error);
                    // Fallback for Vercel without DB connection if needed
                    if (credentials.password === "demo123") {
                        return {
                            id: "fallback-user-id",
                            email: credentials.email,
                            name: "Fallback User",
                            role: "USER"
                        }
                    }
                    throw new Error("Authentication failed. Use demo@kli.com / demo123");
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
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role as string
                (session.user as any).id = token.id as string
            }
            return session
        }
    }
}
