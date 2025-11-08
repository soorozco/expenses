import React from 'react';

interface HeaderProps {
  totalIncome: number;
  totalExpenses: number;
  myExpenses: number;
  otherExpenses: number;
  balance: number;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).format(amount);


const StatCard: React.FC<{ title: string; amount: number; color: string; icon: React.ReactNode; breakdown?: React.ReactNode }> = ({ title, amount, color, icon, breakdown }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
             <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(amount)}</p>
                {breakdown}
            </div>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ totalIncome, totalExpenses, myExpenses, otherExpenses, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Total Income" 
        amount={totalIncome} 
        color="bg-emerald-100 text-emerald-600"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
      />
      <StatCard 
        title="Total Expenses" 
        amount={totalExpenses} 
        color="bg-red-100 text-red-600"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
        breakdown={
            (myExpenses > 0 || otherExpenses > 0) && (
                <p className="text-xs text-slate-500 mt-1">
                    Yours: <span className="font-semibold">{formatCurrency(myExpenses)}</span>
                    {' '}| Other's: <span className="font-semibold">{formatCurrency(otherExpenses)}</span>
                </p>
            )
        }
      />
      <StatCard 
        title="Balance" 
        amount={balance} 
        color="bg-indigo-100 text-indigo-600"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
      />
    </div>
  );
};

export default Header;