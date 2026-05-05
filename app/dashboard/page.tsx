import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
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
      },
      expenses: {
        orderBy: {
          date: 'desc'
        },
        take: 10
      },
      payments: {
        orderBy: {
          date: 'desc'
        },
        take: 10
      }
    }
  })

  const rentConfigs = await prisma.rentConfig.findMany({
    where: {
      householdId: {
        in: households.map(h => h.id)
      },
      isActive: true
    }
  })

  return (
    <DashboardClient 
      households={households} 
      rentConfigs={rentConfigs}
      user={session.user}
    />
  )
}