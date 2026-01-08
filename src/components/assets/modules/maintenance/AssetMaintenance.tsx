import React, { useState } from 'react';
import { Wrench, Calendar, DollarSign } from 'lucide-react';
import Modal from '@/components/shared/Modal';

export default function AssetMaintenance() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Maintenance & Preservation</h2>
                    <p className="text-sm text-slate-600 font-medium">Predictive care for sacred artifacts and infrastructure</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <Wrench size={18} />
                    <span>Schedule Maintenance</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { asset: 'Main Temple Structure', type: 'Preventive', next: 'Feb 15, 2026', status: 'Scheduled' },
                    { asset: 'Gold Jewelry Set', type: 'Predictive', next: 'Jan 20, 2026', status: 'Due Soon' },
                ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-black text-slate-900">{item.asset}</h3>
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-bold uppercase">
                                {item.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>Next: {item.next}</span>
                            </div>
                            <span className="font-medium">{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule Maintenance"
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
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Maintenance Type *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="preventive">Preventive</option>
                            <option value="corrective">Corrective</option>
                            <option value="predictive">Predictive</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Maintenance Date *
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Estimated Cost
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
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
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Schedule Maintenance
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

