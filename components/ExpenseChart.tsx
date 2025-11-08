import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType, ExpenseOwner } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#4f46e5', '#ec4899', '#22c55e', '#f97316', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const [expenseOwnerFilter, setExpenseOwnerFilter] = useState<'all' | ExpenseOwner>('all');
  
  const chartData = useMemo(() => {
    const expenseData = new Map<string, number>();
    transactions
      .filter(t => {
        if (t.type !== TransactionType.EXPENSE) return false;
        if (expenseOwnerFilter === 'all') return true;
        if (expenseOwnerFilter === 'mine') return t.owner === 'mine' || !t.owner;
        if (expenseOwnerFilter === 'other') return t.owner === 'other';
        return false;
      })
      .forEach(t => {
        if (t.category) {
          expenseData.set(t.category, (expenseData.get(t.category) || 0) + t.amount);
        }
      });
    return Array.from(expenseData.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions, expenseOwnerFilter]);

  const hasAnyExpenses = useMemo(() => transactions.some(t => t.type === TransactionType.EXPENSE), [transactions]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800">Expense Breakdown</h3>
        {hasAnyExpenses && (
            <div className="flex rounded-lg border border-slate-200 p-1 space-x-1 mt-2 sm:mt-0">
                <button onClick={() => setExpenseOwnerFilter('all')} className={`px-3 py-1 text-sm font-medium rounded-md ${expenseOwnerFilter === 'all' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100'}`}>All</button>
                <button onClick={() => setExpenseOwnerFilter('mine')} className={`px-3 py-1 text-sm font-medium rounded-md ${expenseOwnerFilter === 'mine' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100'}`}>My Expenses</button>
                <button onClick={() => setExpenseOwnerFilter('other')} className={`px-3 py-1 text-sm font-medium rounded-md ${expenseOwnerFilter === 'other' ? 'bg-orange-500 text-white' : 'hover:bg-slate-100'}`}>Other's</button>
            </div>
        )}
      </div>

      {chartData.length === 0 ? (
         <div className="flex items-center justify-center h-64">
           <p className="text-slate-500 text-center">
             {hasAnyExpenses ? `No expenses for the selected filter.` : `Add some expenses to see a breakdown chart.`}
            </p>
         </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
            <PieChart>
                <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                    );
                }}
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;