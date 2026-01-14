import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CollegeData {
    rankIndia: number;
    name: string;
    cutoff: {
        general?: number;
        obc?: number;
        sc?: number;
        st?: number;
    };
    placements?: {
        averageCTC?: number;
        medianCTC?: number;
        highestCTC?: number;
    };
    diversity?: {
        malePercentage?: number;
        femalePercentage?: number;
    };
}

const colleges: CollegeData[] = [
    { rankIndia: 1, name: "IIM Ahmedabad", cutoff: { general: 99.6, obc: 97.5, sc: 90, st: 85 }, placements: { averageCTC: 34, medianCTC: 31, highestCTC: 120 }, diversity: { malePercentage: 72, femalePercentage: 28 } },
    { rankIndia: 2, name: "IIM Bangalore", cutoff: { general: 99.6, obc: 97.3, sc: 89, st: 84 }, placements: { averageCTC: 35, medianCTC: 32, highestCTC: 115 }, diversity: { malePercentage: 70, femalePercentage: 30 } },
    { rankIndia: 3, name: "IIM Calcutta", cutoff: { general: 99.5, obc: 97, sc: 88, st: 83 }, placements: { averageCTC: 35, medianCTC: 33, highestCTC: 130 }, diversity: { malePercentage: 75, femalePercentage: 25 } },
    { rankIndia: 4, name: "FMS Delhi", cutoff: { general: 99.4, obc: 97, sc: 88, st: 83 }, placements: { averageCTC: 34, medianCTC: 30, highestCTC: 120 }, diversity: { malePercentage: 68, femalePercentage: 32 } },
    { rankIndia: 5, name: "XLRI Jamshedpur", cutoff: { general: 99.2, obc: 96.5, sc: 87, st: 82 }, placements: { averageCTC: 30, medianCTC: 28, highestCTC: 75 } },
    { rankIndia: 6, name: "ISB Hyderabad", cutoff: { general: 98.5 }, placements: { averageCTC: 34, medianCTC: 30, highestCTC: 72 } },
    { rankIndia: 7, name: "IIM Lucknow", cutoff: { general: 99.2 }, placements: { averageCTC: 30, medianCTC: 27, highestCTC: 65 } },
    { rankIndia: 8, name: "SPJIMR Mumbai", cutoff: { general: 98.5 }, placements: { averageCTC: 33, medianCTC: 28, highestCTC: 77 } },
    { rankIndia: 9, name: "IIM Kozhikode", cutoff: { general: 99.0 }, placements: { averageCTC: 28, medianCTC: 25, highestCTC: 60 } },
    { rankIndia: 10, name: "IIM Indore", cutoff: { general: 98.8 }, placements: { averageCTC: 26, medianCTC: 24, highestCTC: 50 } },
    { rankIndia: 11, name: "IIM Mumbai", cutoff: { general: 99.0 }, placements: { averageCTC: 28, medianCTC: 26, highestCTC: 54 } },
    { rankIndia: 12, name: "MDI Gurgaon", cutoff: { general: 97.8 }, placements: { averageCTC: 26, medianCTC: 24, highestCTC: 63 } },
    { rankIndia: 13, name: "IIFT Delhi", cutoff: { general: 97.5 }, placements: { averageCTC: 29, medianCTC: 25, highestCTC: 85 } },
    { rankIndia: 14, name: "JBIMS Mumbai", cutoff: { general: 99.7 }, placements: { averageCTC: 28, medianCTC: 26, highestCTC: 40 } },
    { rankIndia: 15, name: "IIM Shillong", cutoff: { general: 98.5 }, placements: { averageCTC: 26, medianCTC: 23 } },
    { rankIndia: 16, name: "IIM Udaipur", cutoff: { general: 96.5 }, placements: { averageCTC: 20, medianCTC: 18 } },
    { rankIndia: 17, name: "IIM Trichy", cutoff: { general: 96.8 }, placements: { averageCTC: 20, medianCTC: 17 } },
    { rankIndia: 18, name: "IIM Ranchi", cutoff: { general: 95.8 }, placements: { averageCTC: 18 } },
    { rankIndia: 19, name: "IIM Raipur", cutoff: { general: 96.0 }, placements: { averageCTC: 19 } },
    { rankIndia: 20, name: "IIM Kashipur", cutoff: { general: 95.5 }, placements: { averageCTC: 18 } }
]

async function main() {
    console.log(`Start seeding ...`)

    // Clean up existing colleges to avoid conflicts
    await prisma.college.deleteMany({})
    console.log(`Deleted existing colleges`)

    for (const collegeData of colleges) {
        const college = await prisma.college.create({
            data: {
                rankIndia: collegeData.rankIndia,
                name: collegeData.name,
                cutoff: collegeData.cutoff as any,
                placements: collegeData.placements as any,
                diversity: collegeData.diversity as any,
            }
        })
        console.log(`Created college with id: ${college.id}`)
    }
    console.log(`Seeding finished.`)
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
