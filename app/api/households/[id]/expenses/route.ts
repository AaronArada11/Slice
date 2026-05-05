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

  const expenses = await prisma.expense.findMany({
    where: {
      householdId: params.id
    },
    include: {
      paidBy: true
    },
    orderBy: {
      date: 'desc'
    }
  })

  return NextResponse.json(expenses)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, amount, category, splitType, customSplits, notes } = await request.json()

  const expense = await prisma.expense.create({
    data: {
      householdId: params.id,
      title,
      amount,
      category,
      paidById: session.user.id,
      splitType,
      customSplits,
      notes
    }
  })

  return NextResponse.json(expense)
}