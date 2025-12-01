/**
 * Commission Calculation Utilities
 */

const STANDARD_COMMISSION_RATE = parseFloat(process.env.STANDARD_COMMISSION_RATE || '0.15');
const PREMIUM_COMMISSION_RATE = parseFloat(process.env.PREMIUM_COMMISSION_RATE || '0.10');

export interface CommissionCalculation {
  amount: number;
  commissionRate: number;
  commission: number;
  netAmount: number;
}

/**
 * Calculate commission for a transaction
 */
export const calculateCommission = (
  amount: number,
  isPremium: boolean = false
): CommissionCalculation => {
  const commissionRate = isPremium ? PREMIUM_COMMISSION_RATE : STANDARD_COMMISSION_RATE;
  const commission = Math.round(amount * commissionRate * 100) / 100;
  const netAmount = Math.round((amount - commission) * 100) / 100;

  return {
    amount,
    commissionRate,
    commission,
    netAmount,
  };
};

/**
 * Validate milestone amounts against gig budget
 */
export const validateMilestoneAmounts = (
  milestones: Array<{ amount: number }>,
  gigBudget: number
): { valid: boolean; totalAmount: number; message?: string } => {
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);

  if (totalAmount > gigBudget) {
    return {
      valid: false,
      totalAmount,
      message: 'Total milestone amount exceeds gig budget',
    };
  }

  if (totalAmount < gigBudget * 0.9) {
    return {
      valid: false,
      totalAmount,
      message: 'Total milestone amount should be at least 90% of gig budget',
    };
  }

  return {
    valid: true,
    totalAmount,
  };
};

/**
 * Calculate platform earnings
 */
export const calculatePlatformEarnings = (
  transactions: Array<{ commission: number }>
): number => {
  return transactions.reduce((sum, t) => sum + t.commission, 0);
};
