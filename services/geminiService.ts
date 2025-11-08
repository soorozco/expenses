import { GoogleGenAI } from "@google/genai";
import { Transaction, ScheduledPayment } from '../types';

const getFinancialAdvice = async (transactions: Transaction[], scheduledPayments: ScheduledPayment[]): Promise<string> => {
  // This check is for development; in a real app, the API key would be in a secure environment.
  if (!process.env.API_KEY) {
      return "API Key not found. Please set it up to use this feature.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const simplifiedTransactions = transactions.slice(0, 20).map(t => ({
    type: t.type,
    amount: t.amount,
    description: t.description,
    category: t.category || 'N/A',
    owner: t.owner || 'mine'
  }));

  const upcomingPayments = scheduledPayments
    .filter(p => !p.paid && new Date(p.dueDate) >= new Date())
    .slice(0, 10)
    .map(p => ({
        description: p.description,
        amount: p.amount,
        dueDate: p.dueDate,
        category: p.category,
        owner: p.owner || 'mine'
    }));
  
  const prompt = `
    You are a friendly and helpful financial advisor.
    Based on the following JSON data of a user's recent transactions and their upcoming scheduled payments, analyze their financial situation.
    Provide one short, actionable, and encouraging financial tip.
    Keep the response concise and friendly, under 75 words.
    Do not repeat the user's data back to them. Focus only on the advice.
    Some expenses have an "owner" field, which can be 'mine' or 'other'. 'other' indicates an expense the user is paying for someone else.
    Please consider this context when giving your advice. For example, you could acknowledge the financial responsibility of covering someone else's expenses.

    Recent Transaction Data:
    ${JSON.stringify(simplifiedTransactions, null, 2)}

    Upcoming Scheduled Payments:
    ${JSON.stringify(upcomingPayments, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get advice from Gemini API.");
  }
};

export { getFinancialAdvice };