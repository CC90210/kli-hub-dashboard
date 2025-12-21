import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, password } = body

        // Validate input
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

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            )
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim()

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists. Please sign in instead." },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user in database
        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name: name?.trim() || null,
                hashedPassword,
                role: "USER"
            }
        })

        console.log("✅ New user created:", user.email)

        return NextResponse.json({
            success: true,
            message: "Account created successfully!",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error: any) {
        console.error("❌ Signup error:", error)

        // Handle Prisma errors
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Failed to create account. Please try again." },
            { status: 500 }
        )
    }
}
