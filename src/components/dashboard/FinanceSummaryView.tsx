import React from 'react';
import { TrendingUp, Wallet } from 'lucide-react';

interface FinanceItem {
    id: string;
    donor: string;
    amount: string;
    purpose: string;
    time: string;
    day: 'today' | 'tomorrow';
}

const transactions: FinanceItem[] = [
    { id: '1', donor: 'R. K. Industrial Group', amount: '₹15,00,000', purpose: 'Temple Kitchen Fund', time: '11:20 AM', day: 'today' },
    { id: '2', donor: 'Anonymous (Devotee)', amount: '₹5,00,000', purpose: 'Garuda Vahana', time: '09:45 AM', day: 'today' },
    { id: 't1', donor: 'State Endowment Dept', amount: '₹25,00,000', purpose: 'Annual Grant', time: 'Tomorrow, 10:00 AM', day: 'tomorrow' },
    { id: 't2', donor: 'V. S. Trust', amount: '₹12,00,000', purpose: 'Annadanam Scheme', time: 'Tomorrow, 04:30 PM', day: 'tomorrow' }
];

interface FinanceSummaryViewProps {
    filter?: 'today' | 'tomorrow';
}

export default function FinanceSummaryView({ filter = 'today' }: FinanceSummaryViewProps) {
    const filteredTransactions = transactions.filter(item => item.day === filter);

    return (
        <div className="p-4 sm:p-6">
            {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-sm text-neutral-500">No transactions recorded for {filter}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTransactions.map((donation, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 group transition-all"
                        >
                            <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                {idx === 0 ? (
                                    <Wallet size={12} className="text-neutral-900" />
                                ) : (
                                    <TrendingUp size={12} className="text-neutral-900" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900">
                                    {donation.donor}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                                        {donation.time}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2">
                                        {donation.amount}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2 truncate">
                                        {donation.purpose}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
