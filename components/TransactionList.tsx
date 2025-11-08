import React from 'react';
import { Transaction, TransactionType } from '../types';
import TrashIcon from './icons/TrashIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
    const isExpense = transaction.type === TransactionType.EXPENSE;
    const sign = isExpense ? '-' : '+';
    const amountColor = isExpense ? 'text-red-500' : 'text-emerald-500';
    const borderColor = isExpense ? 'border-red-500' : 'border-emerald-500';

    return (
        <li className={`bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border-l-4 ${borderColor} transition-transform transform hover:scale-[1.02] hover:shadow-md`}>
            <div className="flex-grow">
                <div className="flex items-center space-x-2">
                    <p className="font-semibold text-slate-800">{transaction.description}</p>
                    {isExpense && transaction.owner === 'other' && (
                        <span className="text-xs font-semibold text-white bg-orange-500 px-2 py-0.5 rounded-full">Other's</span>
                    )}
                </div>
                {isExpense && transaction.category && (
                    <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-full mt-1">{transaction.category}</p>
                )}
            </div>
            <div className="text-right flex items-center space-x-4">
                 <p className={`font-bold text-lg ${amountColor}`}>
                    {sign}${transaction.amount.toFixed(2)}
                </p>
                <button 
                    onClick={() => onDelete(transaction.id)}
                    className="text-slate-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1 transition-colors"
                    aria-label={`Delete transaction ${transaction.description}`}
                >
                    <TrashIcon />
                </button>
            </div>
        </li>
    );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 text-slate-800">History</h3>
      {transactions.length > 0 ? (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {transactions.map(t => (
                <TransactionItem key={t.id} transaction={t} onDelete={onDeleteTransaction} />
            ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-center py-8">No transactions yet. Add one to get started!</p>
      )}
    </div>
  );
};

export default TransactionList;