export type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

export type Household = {
  id: string
  name: string
  inviteCode: string
  createdAt: Date
  updatedAt: Date
}

export type Membership = {
  id: string
  userId: string
  householdId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: Date
  isActive: boolean
}

export type RentConfig = {
  id: string
  householdId: string
  totalAmount: number
  splitType: 'EQUAL' | 'PERCENTAGE' | 'CUSTOM'
  customSplits?: Record<string, number>
  dueDay: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Expense = {
  id: string
  householdId: string
  title: string
  amount: number
  category: 'UTILITIES' | 'GROCERIES' | 'INTERNET' | 'CABLE' | 'MAINTENANCE' | 'OTHER'
  paidById: string
  splitType: 'EQUAL' | 'PERCENTAGE' | 'CUSTOM'
  customSplits?: Record<string, number>
  date: Date
  notes?: string | null
}

export type Payment = {
  id: string
  householdId: string
  userId: string
  amount: number
  type: 'RENT' | 'EXPENSE' | 'OTHER'
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  date: Date
  notes?: string | null
}

export type Balance = {
  userId: string
  name: string
  amount: number
}

export type Debt = {
  from: string
  to: string
  amount: number
}