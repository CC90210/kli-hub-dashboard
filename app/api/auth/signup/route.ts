import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        // Check if database is configured
        const hasDatabase = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

        if (!hasDatabase) {
            return NextResponse.json(
                {
                    error: "Database not configured for new signups. Please use demo credentials to sign in.",
                    demoCredentials: {
                        email: "demo@kli.com",
                        password: "demo1234"
                    }
                },
                { status: 503 }
            )
        }

        const body = await req.json()
        const { name, email, password, jobTitle } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            )
        }

        // Dynamic imports to prevent crash if modules missing
        const bcrypt = await import('bcryptjs')

        // Safer Prisma import
        let prisma;
        try {
            const { PrismaClient } = await import('@prisma/client')
            prisma = new PrismaClient()
        } catch (e) {
            console.error("Prisma import failed", e);
            return NextResponse.json(
                {
                    error: "Database client unavailable. Please use demo credentials.",
                    demoCredentials: {
                        email: "demo@kli.com",
                        password: "demo1234"
                    }
                },
                { status: 500 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Check existing user
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (existingUser) {
            await prisma.$disconnect()
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            )
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name: name?.trim() || null,
                jobTitle: jobTitle?.trim() || null,
                hashedPassword,
                role: "USER"
            }
        })

        await prisma.$disconnect()

        return NextResponse.json({
            success: true,
            message: "Account created successfully"
        })

    } catch (error: any) {
        console.error("Signup error:", error)

        // Provide specific error messages
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            )
        }

        // Database connection errors
        if (error.code === 'P1001' || error.code === 'P1002') {
            return NextResponse.json(
                {
                    error: "Cannot connect to database. Please use demo credentials.",
                    demoCredentials: {
                        email: "demo@kli.com",
                        password: "demo1234"
                    }
                },
                { status: 503 }
            )
        }

        return NextResponse.json(
            {
                error: "Signup failed. Please try again or use demo credentials.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            },
            { status: 500 }
        )
    }
}

