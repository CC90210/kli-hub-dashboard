import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('KLI-Admin-2024!', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@kli.com' },
        update: {},
        create: {
            email: 'admin@kli.com',
            name: 'KLI Admin',
            hashedPassword,
            role: 'ADMIN'
        }
    })

    // Create standard user
    const testPassword = await bcrypt.hash('KLI-User-2024!', 12)

    const user = await prisma.user.upsert({
        where: { email: 'user@kli.com' },
        update: {},
        create: {
            email: 'user@kli.com',
            name: 'KLI User',
            hashedPassword: testPassword,
            role: 'USER'
        }
    })

    console.log('✅ Database seeded successfully')
    console.log('Admin:', admin.email)
    console.log('User:', user.email)
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
