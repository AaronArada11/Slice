import { RentConfig, Expense, Balance, Debt } from './types'

/**
 * Calculate rent splits based on configuration
 */
export function calculateRentSplits(
  rentConfig: RentConfig,
  memberIds: string[]
): Record<string, number> {
  const { totalAmount, splitType, customSplits } = rentConfig

  switch (splitType) {
    case 'EQUAL':
      const equalShare = totalAmount / memberIds.length
      return memberIds.reduce((acc, id) => ({ ...acc, [id]: equalShare }), {})

    case 'PERCENTAGE':
      if (!customSplits) {
        throw new Error('Custom splits required for percentage split')
      }
      return Object.entries(customSplits).reduce(
        (acc, [id, percentage]) => ({
          ...acc,
          [id]: (totalAmount * percentage) / 100
        }),
        {}
      )

    case 'CUSTOM':
      if (!customSplits) {
        throw new Error('Custom splits required for custom split')
      }
      return customSplits

    default:
      throw new Error('Invalid split type')
  }
}

/**
 * Calculate expense splits based on configuration
 */
export function calculateExpenseSplits(
  expense: Expense,
  memberIds: string[]
): Record<string, number> {
  const { amount, splitType, customSplits } = expense

  switch (splitType) {
    case 'EQUAL':
      const equalShare = amount / memberIds.length
      return memberIds.reduce((acc, id) => ({ ...acc, [id]: equalShare }), {})

    case 'PERCENTAGE':
      if (!customSplits) {
        throw new Error('Custom splits required for percentage split')
      }
      return Object.entries(customSplits).reduce(
        (acc, [id, percentage]) => ({
          ...acc,
          [id]: (amount * percentage) / 100
        }),
        {}
      )

    case 'CUSTOM':
      if (!customSplits) {
        throw new Error('Custom splits required for custom split')
      }
      return customSplits

    default:
      throw new Error('Invalid split type')
  }
}

/**
 * Calculate balances for all members
 */
export function calculateBalances(
  memberIds: string[],
  rentSplits: Record<string, number>,
  expenseSplits: Record<string, number>,
  payments: { userId: string; amount: number }[],
  memberNames?: Record<string, string>
): Balance[] {
  const balances: Record<string, number> = {}

  // Initialize balances
  memberIds.forEach(id => {
    balances[id] = 0
  })

  // Add rent amounts owed
  Object.entries(rentSplits).forEach(([id, amount]) => {
    balances[id] = (balances[id] || 0) + amount
  })

  // Add expense amounts owed
  Object.entries(expenseSplits).forEach(([id, amount]) => {
    balances[id] = (balances[id] || 0) + amount
  })

  // Subtract payments made
  payments.forEach(({ userId, amount }) => {
    balances[userId] = (balances[userId] || 0) - amount
  })

  return Object.entries(balances).map(([userId, amount]) => ({
    userId,
    name: memberNames?.[userId] || '',
    amount
  }))
}

/**
 * Simplify debts using the minimum transactions algorithm
 */
export function simplifyDebts(balances: Balance[]): Debt[] {
  const debts: Debt[] = []
  const balanceMap = new Map(balances.map(b => [b.userId, b.amount]))

  // Separate creditors and debtors
  const creditors = balances
    .filter(b => b.amount > 0)
    .sort((a, b) => b.amount - a.amount)
  const debtors = balances
    .filter(b => b.amount < 0)
    .sort((a, b) => a.amount)

  // Match debtors to creditors
  for (const debtor of debtors) {
    let remainingDebt = Math.abs(debtor.amount)

    for (const creditor of creditors) {
      if (remainingDebt <= 0) break

      const availableCredit = creditor.amount
      const transferAmount = Math.min(remainingDebt, availableCredit)

      if (transferAmount > 0) {
        debts.push({
          from: debtor.userId,
          to: creditor.userId,
          amount: transferAmount
        })

        balanceMap.set(debtor.userId, balanceMap.get(debtor.userId)! + transferAmount)
        balanceMap.set(creditor.userId, balanceMap.get(creditor.userId)! - transferAmount)

        remainingDebt -= transferAmount
      }
    }
  }

  return debts
}

/**
 * Get payment status for a user
 */
export function getPaymentStatus(
  userId: string,
  totalDue: number,
  payments: { userId: string; amount: number }[]
): 'PAID' | 'PARTIAL' | 'PENDING' {
  const totalPaid = payments
    .filter(p => p.userId === userId)
    .reduce((sum, p) => sum + p.amount, 0)

  if (totalPaid >= totalDue) return 'PAID'
  if (totalPaid > 0) return 'PARTIAL'
  return 'PENDING'
}