export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const ExpenseOwners = ['mine', 'other'] as const;
export type ExpenseOwner = (typeof ExpenseOwners)[number];

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category?: ExpenseCategory;
  date: string;
  owner?: ExpenseOwner;
}

export const ExpenseCategories = [
  'Food', 'Gas', 'Water', 'Housing', 'Transportation', 'Entertainment', 'Shopping', 'Health', 'Electricity', 'Internet', 'Home appliances', 'Medication', 'Credit Card', 'Other'
] as const;

export type ExpenseCategory = (typeof ExpenseCategories)[number];

export interface ScheduledPayment {
  id: string;
  seriesId: string; // To group recurring payments
  description: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD format
  category: ExpenseCategory;
  paid: boolean;
  owner?: ExpenseOwner;
}

export interface InvestmentAccount {
  id: string;
  name: string;
  amount: number;
  rate: number; // Annual interest rate in percent
}