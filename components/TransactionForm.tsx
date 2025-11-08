import React, { useState } from 'react';
import { Transaction, TransactionType, ExpenseCategories, ExpenseCategory, ExpenseOwner } from '../types';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [owner, setOwner] = useState<ExpenseOwner>('mine');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || isNaN(numericAmount) || numericAmount <= 0) {
        alert("Please enter a valid description and a positive amount.");
        return;
    }

    const newTransaction: Omit<Transaction, 'id' | 'date'> = {
        type,
        description,
        amount: numericAmount,
        ...(type === TransactionType.EXPENSE && { category, owner }),
    };

    onAddTransaction(newTransaction);
    setDescription('');
    setAmount('');
    setCategory('Food');
    setOwner('mine');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Add New Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <div className="flex rounded-lg border border-slate-200 p-1">
            <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                Expense
            </button>
            <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                Income
            </button>
            </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === TransactionType.EXPENSE ? "e.g., Groceries" : "e.g., Paycheck"}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {type === TransactionType.EXPENSE && (
          <>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                {ExpenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Expense For</label>
                <div className="flex rounded-lg border border-slate-200 p-1 space-x-1">
                    <button type="button" onClick={() => setOwner('mine')} className={`w-full py-2 text-sm font-medium rounded-md ${owner === 'mine' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100'}`}>My Expense</button>
                    <button type="button" onClick={() => setOwner('other')} className={`w-full py-2 text-sm font-medium rounded-md ${owner === 'other' ? 'bg-orange-500 text-white' : 'hover:bg-slate-100'}`}>Other's Expense</button>
                </div>
            </div>
          </>
        )}
        <button type="submit" className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;