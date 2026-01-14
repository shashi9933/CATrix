import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.college.count()
    console.log(`Total colleges: ${count}`)

    if (count > 0) {
        const iimA = await prisma.college.findFirst({
            where: { name: 'IIM Ahmedabad' }
        })
        console.log('Sample College:', JSON.stringify(iimA, null, 2))
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
