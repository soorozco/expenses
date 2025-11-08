import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, ScheduledPayment, InvestmentAccount } from './types';
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import GeminiAdvice from './components/GeminiAdvice';
import ScheduledPayments from './components/ScheduledPayments';
import InvestmentCalculator from './components/InvestmentCalculator';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const localData = localStorage.getItem('transactions');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse transactions from localStorage", error);
      return [];
    }
  });

  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>(() => {
    try {
      const localData = localStorage.getItem('scheduledPayments');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse scheduled payments from localStorage", error);
      return [];
    }
  });

  const [investmentAccounts, setInvestmentAccounts] = useState<InvestmentAccount[]>(() => {
    try {
      const localData = localStorage.getItem('investmentAccounts');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse investment accounts from localStorage", error);
      return [];
    }
  });


  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('scheduledPayments', JSON.stringify(scheduledPayments));
  }, [scheduledPayments]);

  useEffect(() => {
    localStorage.setItem('investmentAccounts', JSON.stringify(investmentAccounts));
  }, [investmentAccounts]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addScheduledPayments = (payments: Omit<ScheduledPayment, 'id' | 'paid' | 'seriesId'>[]) => {
    const seriesId = crypto.randomUUID();
    const newPayments: ScheduledPayment[] = payments.map(p => ({
      ...p,
      id: crypto.randomUUID(),
      paid: false,
      seriesId: seriesId,
    }));
    setScheduledPayments(prev => [...prev, ...newPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  };

  const markPaymentAsPaid = (paymentId: string) => {
    const payment = scheduledPayments.find(p => p.id === paymentId);
    if (payment && !payment.paid) {
        addTransaction({
            type: TransactionType.EXPENSE,
            description: payment.description,
            amount: payment.amount,
            category: payment.category,
            owner: payment.owner,
        });
        setScheduledPayments(prev => 
            prev.map(p => p.id === paymentId ? { ...p, paid: true } : p)
        );
    }
  };

  const deleteScheduledPayment = (paymentId: string) => {
    setScheduledPayments(prev => prev.filter(p => p.id !== paymentId));
  };
  
  const deleteScheduledPaymentSeries = (seriesId: string) => {
    setScheduledPayments(prev => prev.filter(p => p.seriesId !== seriesId));
  };
  
  const addInvestmentAccount = (account: Omit<InvestmentAccount, 'id'>) => {
    const newAccount: InvestmentAccount = {
      ...account,
      id: crypto.randomUUID(),
    };
    setInvestmentAccounts(prev => [...prev, newAccount]);
  };

  const deleteInvestmentAccount = (id: string) => {
    setInvestmentAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const { totalIncome, totalExpenses, myExpenses, otherExpenses, balance } = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);

    const myExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE && (t.owner === 'mine' || !t.owner))
      .reduce((acc, t) => acc + t.amount, 0);

    const otherExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.owner === 'other')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = myExpenses + otherExpenses;
    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, myExpenses, otherExpenses, balance };
  }, [transactions]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Expense Tracker</h1>
          <p className="text-slate-500 mt-2">Powered by Gemini AI</p>
        </header>

        <Header 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          myExpenses={myExpenses}
          otherExpenses={otherExpenses}
          balance={balance}
        />

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <TransactionForm onAddTransaction={addTransaction} />
            <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
            <InvestmentCalculator 
              accounts={investmentAccounts}
              onAddAccount={addInvestmentAccount}
              onDeleteAccount={deleteInvestmentAccount}
            />
          </div>
          <div className="lg:col-span-3 space-y-8">
             <ExpenseChart transactions={transactions} />
             <GeminiAdvice transactions={transactions} scheduledPayments={scheduledPayments} />
             <ScheduledPayments 
                payments={scheduledPayments}
                onAddPayments={addScheduledPayments}
                onMarkAsPaid={markPaymentAsPaid}
                onDeletePayment={deleteScheduledPayment}
                onDeletePaymentSeries={deleteScheduledPaymentSeries}
             />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;