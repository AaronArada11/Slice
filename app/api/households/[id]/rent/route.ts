import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rentConfig = await prisma.rentConfig.findFirst({
    where: {
      householdId: params.id,
      isActive: true
    }
  })

  return NextResponse.json(rentConfig)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { totalAmount, splitType, customSplits, dueDay } = await request.json()

  // Deactivate existing config
  await prisma.rentConfig.updateMany({
    where: {
      householdId: params.id,
      isActive: true
    },
    data: {
      isActive: false
    }
  })

  const rentConfig = await prisma.rentConfig.create({
    data: {
      householdId: params.id,
      totalAmount,
      splitType,
      customSplits,
      dueDay: dueDay || 1,
      createdBy: session.user.id
    }
  })

  return NextResponse.json(rentConfig)
}