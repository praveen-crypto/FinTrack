export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}

export interface FixedExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface SavingsGoalItem {
  id: string;
  name: string;
  amount: number; // Can be absolute or percentage target, for simplicity using absolute amount
  isPercentage?: boolean; // True if amount is a percentage of income
}

export interface EmiItem {
  id: string;
  loanType: string;
  principal: number;
  interestRate: number; // Annual percentage
  tenure: number; // In months
  monthlyInstallment: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface FinancialData {
  monthlyIncome: number;
  fixedExpenses: FixedExpenseItem[];
  savingsGoals: SavingsGoalItem[];
  emis: EmiItem[];
  generalExpenses: ExpenseItem[];
}
