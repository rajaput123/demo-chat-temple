import React, { useState } from 'react';
import { PlusCircle, Building2, DollarSign } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { AssetLifecycleState } from '@/types/asset';

export default function AssetAcquisition() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    type AssetCategory = 'physical-general' | 'physical-sacred' | 'digital' | 'property' | 'financial';
    
    const [formData, setFormData] = useState<{
        name: string;
        category: AssetCategory;
        type: string;
        departmentId: string;
        acquisitionCost: string;
        acquisitionDate: string;
        description: string;
    }>({
        name: '',
        category: 'physical-general',
        type: '',
        departmentId: '',
        acquisitionCost: '',
        acquisitionDate: new Date().toISOString().split('T')[0],
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Asset starts in 'get' state (Acquire)
        console.log('Acquiring asset:', formData);
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Onboarding & Acquisition</h2>
                    <p className="text-sm text-slate-600 font-medium">Formal entry for donations, purchases, and grants</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <PlusCircle size={18} />
                    <span>Acquire Asset</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                    <Building2 className="text-slate-400 mb-3" size={24} />
                    <h3 className="text-sm font-black text-slate-900 mb-1">Donation</h3>
                    <p className="text-xs text-slate-500">Gifts and contributions</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                    <DollarSign className="text-slate-400 mb-3" size={24} />
                    <h3 className="text-sm font-black text-slate-900 mb-1">Purchase</h3>
                    <p className="text-xs text-slate-500">Procured assets</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                    <PlusCircle className="text-slate-400 mb-3" size={24} />
                    <h3 className="text-sm font-black text-slate-900 mb-1">Grant</h3>
                    <p className="text-xs text-slate-500">Granted assets</p>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Acquire Asset"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Asset Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as AssetCategory })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            >
                                <option value="physical-general">Physical - General</option>
                                <option value="sacred-valuable">Sacred & Valuable</option>
                                <option value="property">Property</option>
                                <option value="knowledge">Knowledge</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Department *
                            </label>
                            <select
                                required
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            >
                                <option value="">Select Department</option>
                                {/* Departments will be loaded from People module */}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Acquisition Cost *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.acquisitionCost}
                                onChange={(e) => setFormData({ ...formData, acquisitionCost: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Acquisition Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.acquisitionDate}
                                onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                            Asset will be created in <strong>&apos;get&apos;</strong> state (Acquire). Next step: Register in Asset Registry.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Acquire Asset
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

