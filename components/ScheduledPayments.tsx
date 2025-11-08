import React, { useState, useMemo } from 'react';
import { ScheduledPayment, ExpenseCategory, ExpenseCategories, ExpenseOwner } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';

interface ScheduledPaymentsProps {
    payments: ScheduledPayment[];
    onAddPayments: (payments: Omit<ScheduledPayment, 'id' | 'paid' | 'seriesId'>[]) => void;
    onMarkAsPaid: (id: string) => void;
    onDeletePayment: (id: string) => void;
    onDeletePaymentSeries: (seriesId: string) => void;
}

const ScheduledPayments: React.FC<ScheduledPaymentsProps> = ({ payments, onAddPayments, onMarkAsPaid, onDeletePayment, onDeletePaymentSeries }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('Housing');
    const [owner, setOwner] = useState<ExpenseOwner>('mine');
    const [recurrenceCount, setRecurrenceCount] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState<ScheduledPayment | null>(null);


    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const paymentDates = useMemo(() => new Set(payments.map(p => p.dueDate.substring(0, 10))), [payments]);

    const handleDateClick = (day: number) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!description || isNaN(numericAmount) || numericAmount <= 0) {
            alert("Please enter a valid description and amount.");
            return;
        }

        const paymentsToAdd: Omit<ScheduledPayment, 'id' | 'paid' | 'seriesId'>[] = [];
        const baseDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12);

        for (let i = 0; i < recurrenceCount; i++) {
            const nextDate = new Date(baseDate);
            nextDate.setMonth(baseDate.getMonth() + i);
            paymentsToAdd.push({
                description,
                amount: numericAmount,
                category,
                owner,
                dueDate: nextDate.toISOString().substring(0, 10),
            });
        }
        
        onAddPayments(paymentsToAdd);
        setDescription('');
        setAmount('');
        setRecurrenceCount(1);
        setOwner('mine');
    };

    const selectedDateStr = selectedDate.toISOString().substring(0, 10);
    const paymentsForSelectedDate = payments.filter(p => p.dueDate.substring(0, 10) === selectedDateStr);

    const isSeries = useMemo(() => {
        if (!confirmDelete) return false;
        return payments.some(p => p.seriesId === confirmDelete.seriesId && p.id !== confirmDelete.id);
    }, [confirmDelete, payments]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center"><CalendarIcon /><span className="ml-2">Scheduled Payments</span></h3>
            </div>

            {/* Calendar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="px-2 py-1 rounded-md hover:bg-slate-100">&lt;</button>
                    <h4 className="font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="px-2 py-1 rounded-md hover:bg-slate-100">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="font-medium text-slate-500">{d}</div>)}
                    {Array.from({ length: firstDayOfMonth.getDay() }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().substring(0, 10);
                        const hasPayment = paymentDates.has(dateStr);
                        const isSelected = selectedDate && dateStr === selectedDate.toISOString().substring(0,10);
                        
                        return (
                            <div key={day} onClick={() => handleDateClick(day)} className={`p-2 rounded-full cursor-pointer relative ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}>
                                {day}
                                {hasPayment && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-pink-500'}`}></span>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Payment List and Form */}
            <div>
                <h4 className="font-bold text-slate-700 mb-2">
                    Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h4>

                {paymentsForSelectedDate.length > 0 && (
                    <ul className="space-y-2 mb-4">
                    {paymentsForSelectedDate.map(p => (
                        <li key={p.id} className={`flex items-center justify-between p-2 rounded-md transition-colors ${p.paid ? 'bg-slate-100 text-slate-400' : 'bg-slate-50'}`}>
                            <div className={p.paid ? 'line-through' : ''}>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium text-slate-800">{p.description}</p>
                                    {p.owner === 'other' && (
                                        <span className="text-xs font-semibold text-white bg-orange-500 px-2 py-0.5 rounded-full">Other's</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500">${p.amount.toFixed(2)} - {p.category}</p>
                            </div>
                            {!p.paid ? (
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => onMarkAsPaid(p.id)} aria-label="Mark as paid" className="p-1 text-emerald-500 hover:text-emerald-700"><CheckIcon /></button>
                                    <button onClick={() => setConfirmDelete(p)} aria-label="Delete payment" className="p-1 text-slate-400 hover:text-red-600"><TrashIcon /></button>
                                </div>
                            ) : (
                                <span className="text-sm font-semibold text-emerald-600">Paid</span>
                            )}
                        </li>
                    ))}
                    </ul>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-slate-200">
                    <input type="text" placeholder="New payment description..." value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    <div className="flex space-x-2">
                        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            {ExpenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="recurrence" className="block text-sm font-medium text-slate-600 mb-1">Repeat monthly (times)</label>
                        <input 
                            type="number" 
                            id="recurrence"
                            min="1"
                            value={recurrenceCount}
                            onChange={e => setRecurrenceCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Expense For</label>
                        <div className="flex rounded-lg border border-slate-200 p-1 space-x-1">
                            <button type="button" onClick={() => setOwner('mine')} className={`w-full py-2 text-sm font-medium rounded-md ${owner === 'mine' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100'}`}>My Expense</button>
                            <button type="button" onClick={() => setOwner('other')} className={`w-full py-2 text-sm font-medium rounded-md ${owner === 'other' ? 'bg-orange-500 text-white' : 'hover:bg-slate-100'}`}>Other's Expense</button>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Payment</button>
                </form>
            </div>
            
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                        <p className="text-slate-600 mb-6">Are you sure you want to delete "{confirmDelete.description}"?</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    onDeletePayment(confirmDelete.id);
                                    setConfirmDelete(null);
                                }}
                                className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete Just This One
                            </button>
                            {isSeries && (
                                <button
                                    onClick={() => {
                                        onDeletePaymentSeries(confirmDelete.seriesId);
                                        setConfirmDelete(null);
                                    }}
                                    className="w-full py-2 px-4 bg-red-700 text-white font-semibold rounded-lg shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
                                >
                                    Delete Entire Series
                                </button>
                            )}
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="w-full py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduledPayments;