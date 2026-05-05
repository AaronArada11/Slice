import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const households = await prisma.household.findMany({
    where: {
      memberships: {
        some: {
          userId: session.user.id,
          isActive: true
        }
      }
    },
    include: {
      memberships: {
        include: {
          user: true
        }
      }
    }
  })

  return NextResponse.json(households)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await request.json()

  const household = await prisma.household.create({
    data: {
      name,
      memberships: {
        create: {
          userId: session.user.id,
          role: 'OWNER'
        }
      }
    }
  })

  return NextResponse.json(household)
}