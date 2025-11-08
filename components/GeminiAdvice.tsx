
import React, { useState } from 'react';
import { Transaction, ScheduledPayment } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface GeminiAdviceProps {
  transactions: Transaction[];
  scheduledPayments: ScheduledPayment[];
}

const GeminiAdvice: React.FC<GeminiAdviceProps> = ({ transactions, scheduledPayments }) => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetAdvice = async () => {
    if (transactions.length < 3 && scheduledPayments.length === 0) {
      setError("Add at least 3 transactions or a scheduled payment to get personalized advice.");
      return;
    }
    setIsLoading(true);
    setError('');
    setAdvice('');
    try {
      const result = await getFinancialAdvice(transactions, scheduledPayments);
      setAdvice(result);
    } catch (err) {
      setError("Sorry, I couldn't get any advice right now. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
         <h3 className="text-xl font-bold text-slate-800">Gemini Financial Tip</h3>
         <span className="text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-1 rounded-full">AI</span>
      </div>
     
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             <p className="ml-3 text-slate-500">Analyzing your habits...</p>
          </div>
        ) : advice ? (
          <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
            <p className="text-slate-700 italic">{advice}</p>
          </blockquote>
        ) : (
             <p className="text-slate-500">Click the button to get a personalized financial tip based on your recent activity.</p>
        )}
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="mt-6">
        <button
          onClick={handleGetAdvice}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isLoading ? 'Thinking...' : 'Get Advice'}
        </button>
      </div>
    </div>
  );
};

export default GeminiAdvice;
