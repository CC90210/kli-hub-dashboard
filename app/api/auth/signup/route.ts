import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        // Check if database is configured
        if (!process.env.DATABASE_URL) {
            return NextResponse.json(
                { error: "Database not configured. Please contact administrator." },
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
                { error: "Database client missing" },
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
        return NextResponse.json(
            { error: "Failed to create account. Please try again." },
            { status: 500 }
        )
    }
}
