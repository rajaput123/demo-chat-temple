import React, { useState } from 'react';
import { Truck, MapPin, User } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { AssetMovement as AssetMovementType } from '@/types/asset';

export default function AssetMovement() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Movement Tracking</h2>
                    <p className="text-sm text-slate-600 font-medium">Utilization logs and intra-temple movement control</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <Truck size={18} />
                    <span>Record Movement</span>
                </button>
            </div>

            <div className="space-y-3">
                {[
                    { asset: 'Suvarna Kavacha', from: 'Garbhagriha', to: 'Procession Hall', date: 'Jan 6, 2026', by: 'Keshav Bhat' },
                    { asset: 'Dharma Chariot', from: 'Storage', to: 'Main Courtyard', date: 'Jan 5, 2026', by: 'Arjun Das' },
                ].map((movement, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-900 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Truck className="text-slate-400" size={20} />
                                <div>
                                    <p className="text-sm font-black text-slate-900">{movement.asset}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin size={12} className="text-slate-400" />
                                        <span className="text-xs text-slate-500">{movement.from} → {movement.to}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-slate-600">{movement.date}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <User size={12} className="text-slate-400" />
                                    <span className="text-xs text-slate-500">{movement.by}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Record Asset Movement"
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
                                From Location
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                To Location *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Reason *
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
                            Record Movement
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

