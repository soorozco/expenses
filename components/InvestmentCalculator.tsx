
import React, { useState, useMemo } from 'react';
import { InvestmentAccount } from '../types';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrashIcon from './icons/TrashIcon';

interface InvestmentCalculatorProps {
  accounts: InvestmentAccount[];
  onAddAccount: (account: Omit<InvestmentAccount, 'id'>) => void;
  onDeleteAccount: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ accounts, onAddAccount, onDeleteAccount }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    const numericRate = parseFloat(rate);

    if (!name || isNaN(numericAmount) || numericAmount <= 0 || isNaN(numericRate) || numericRate < 0) {
      alert('Please enter a valid name, principal (>0), and rate (>=0).');
      return;
    }
    onAddAccount({ name, amount: numericAmount, rate: numericRate });
    setName('');
    setAmount('');
    setRate('');
  };
  
  const { totalInvested, totalProjectedValue } = useMemo(() => {
    const totalInvested = accounts.reduce((sum, acc) => sum + acc.amount, 0);
    const totalProjectedValue = accounts.reduce((sum, acc) => sum + acc.amount * (1 + acc.rate / 100), 0);
    return { totalInvested, totalProjectedValue };
  }, [accounts]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
        <TrendingUpIcon />
        <span className="ml-2">Investment Portfolio</span>
      </h3>
      
      {/* Investment Accounts List */}
      <div className="space-y-3 mb-6">
        {accounts.length > 0 ? (
          accounts.map(acc => {
            const futureValue = acc.amount * (1 + acc.rate / 100);
            return (
              <div key={acc.id} className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{acc.name}</p>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(acc.amount)} @ {acc.rate.toFixed(2)}%
                  </p>
                  <p className="text-sm font-semibold text-emerald-600">
                    1-Yr: {formatCurrency(futureValue)}
                  </p>
                </div>
                <button 
                  onClick={() => onDeleteAccount(acc.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded-full"
                  aria-label={`Delete ${acc.name} account`}
                >
                  <TrashIcon />
                </button>
              </div>
            )
          })
        ) : (
          <p className="text-slate-500 text-center py-4">Add an investment account to get started.</p>
        )}
      </div>

       {/* Summary */}
      {accounts.length > 0 && (
         <div className="mb-6 p-4 bg-emerald-50 border-t-4 border-emerald-500 rounded-b-lg">
           <div className="flex justify-between items-center">
             <span className="font-semibold text-slate-600">Total Invested:</span>
             <span className="font-bold text-slate-800 text-lg">{formatCurrency(totalInvested)}</span>
           </div>
            <div className="flex justify-between items-center mt-2">
             <span className="font-semibold text-emerald-700">Total Projected (1 Yr):</span>
             <span className="font-bold text-emerald-700 text-lg">{formatCurrency(totalProjectedValue)}</span>
           </div>
         </div>
      )}


      {/* Add New Account Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 pt-4">
        <h4 className="font-bold text-slate-700">Add New Investment</h4>
        <div>
          <label htmlFor="acc-name" className="block text-sm font-medium text-slate-600 mb-1">Account Name</label>
          <input
            type="text" id="acc-name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Cetes"
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
        <div className="flex space-x-2">
           <div className="w-1/2">
             <label htmlFor="acc-amount" className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
             <input
               type="number" id="acc-amount" value={amount} onChange={(e) => setAmount(e.target.value)}
               placeholder="1000"
               className="w-full px-3 py-2 border border-slate-300 rounded-md"
             />
           </div>
           <div className="w-1/2">
             <label htmlFor="acc-rate" className="block text-sm font-medium text-slate-600 mb-1">Rate (%)</label>
             <input
               type="number" id="acc-rate" value={rate} onChange={(e) => setRate(e.target.value)}
               placeholder="7.5"
               className="w-full px-3 py-2 border border-slate-300 rounded-md"
             />
           </div>
        </div>
        <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
          Add Investment Account
        </button>
      </form>
    </div>
  );
};

export default InvestmentCalculator;
