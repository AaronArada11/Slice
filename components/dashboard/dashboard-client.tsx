'use client'

import { useState } from 'react'
import { Household, RentConfig, User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Users, DollarSign, Receipt } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface DashboardClientProps {
  households: Household[]
  rentConfigs: RentConfig[]
  user: User
}

export default function DashboardClient({ 
  households, 
  rentConfigs, 
  user 
}: DashboardClientProps) {
  const [activeHousehold, setActiveHousehold] = useState<Household | null>(
    households[0] || null
  )

  if (!activeHousehold) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Slice
            </h1>
            <p className="text-gray-600 mb-8">
              You haven't joined any households yet. Create or join one to get started.
            </p>
            <Link href="/household/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Household
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const rentConfig = rentConfigs.find(c => c.householdId === activeHousehold.id)
  const totalRent = rentConfig?.totalAmount || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeHousehold.name}
          </h1>
          <p className="text-gray-600">
            {activeHousehold.memberships.length} members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rent
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRent)}
              </div>
              <p className="text-xs text-muted-foreground">
                Due on day {rentConfig?.dueDay || 1}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeHousehold.memberships.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active roommates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expenses
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeHousehold.expenses.length}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/household/${activeHousehold.id}/expenses/new`}>
                <Button className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </Link>
              <Link href={`/household/${activeHousehold.id}/rent`}>
                <Button variant="outline" className="w-full justify-start">
                  Configure Rent
                </Button>
              </Link>
              <Link href={`/household/${activeHousehold.id}/members`}>
                <Button variant="outline" className="w-full justify-start">
                  Invite Members
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeHousehold.expenses.slice(0, 5).map(expense => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{expense.title}</p>
                      <p className="text-sm text-gray-500">
                        Paid by {expense.paidBy.name}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}