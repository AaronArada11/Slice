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

  const payments = await prisma.payment.findMany({
    where: {
      householdId: params.id
    },
    include: {
      user: true
    },
    orderBy: {
      date: 'desc'
    }
  })

  return NextResponse.json(payments)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount, type, notes } = await request.json()

  const payment = await prisma.payment.create({
    data: {
      householdId: params.id,
      userId: session.user.id,
      amount,
      type,
      status: 'COMPLETED',
      notes
    }
  })

  return NextResponse.json(payment)
}