import React, { useState } from 'react';
import { LineChart, DollarSign, TrendingUp } from 'lucide-react';
import Modal from '@/components/shared/Modal';

export default function AssetValuation() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Valuation & Finance</h2>
                    <p className="text-sm text-slate-600 font-medium">Financial linkage, appreciation, and balance sheet integration</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <LineChart size={18} />
                    <span>Record Valuation</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { asset: 'Suvarna Kavacha', value: '₹2,50,00,000', method: 'Appraisal', date: 'Jan 1, 2026' },
                    { asset: 'Temple Land', value: '₹15,00,00,000', method: 'Market', date: 'Dec 1, 2025' },
                ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-black text-slate-900">{item.asset}</h3>
                            <TrendingUp className="text-green-600" size={16} />
                        </div>
                        <p className="text-lg font-black text-slate-900 mb-1">{item.value}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{item.method}</span>
                            <span>{item.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Record Asset Valuation"
                size="md"
            >
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Select Asset *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="">Select Asset</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Valuation Amount *
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Valuation Method *
                            </label>
                            <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                                <option value="market">Market</option>
                                <option value="depreciation">Depreciation</option>
                                <option value="appraisal">Appraisal</option>
                                <option value="historical">Historical</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Notes
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                            Valuation will be linked to Finance module for balance sheet integration. Finance module has read-only access.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Record Valuation
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

