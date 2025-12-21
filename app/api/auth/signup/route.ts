import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters")
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Validate input
        const result = signupSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, password, name } = result.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase().trim(),
                name: name.trim(),
                hashedPassword,
                role: "USER"
            }
        })

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { error: "Failed to create account. Please try again." },
            { status: 500 }
        )
    }
}
