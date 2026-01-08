
import React, { useState } from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Calendar, Users, Lock, Unlock, Plus, Trash2, AlertTriangle, Check } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { mockRecipes } from '@/data/mockOperationsData';

export default function PlanningTab() {
    const { dailyPlan, addPlannedItem, deletePlannedItem, approvePlan } = useKitchen();
    const isLocked = dailyPlan.status === 'Locked' || dailyPlan.status === 'Approved';

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        recipeId: '',
        recipeName: '',
        category: 'Prasad' as 'Prasad' | 'Annadanam' | 'Naivedya',
        targetQuantity: '',
        unit: 'kg',
        batchCount: 1
    });

    const handleAddItem = () => {
        if (!formData.recipeId || !formData.targetQuantity) {
            alert('Please select a recipe and enter quantity');
            return;
        }

        addPlannedItem({
            recipeId: formData.recipeId,
            recipeName: formData.recipeName,
            category: formData.category,
            targetQuantity: parseInt(formData.targetQuantity),
            unit: formData.unit,
            batchCount: Math.ceil(parseInt(formData.targetQuantity) / 50) // Auto-calculate batches
        });

        // Reset form
        setFormData({
            recipeId: '',
            recipeName: '',
            category: 'Prasad',
            targetQuantity: '',
            unit: 'kg',
            batchCount: 1
        });
        setShowAddModal(false);
    };

    const handleApprove = () => {
        approvePlan();
        setShowApproveModal(false);
    };

    const handleDelete = (id: string) => {
        deletePlannedItem(id);
        setDeleteItemId(null);
    };

    return (
        <>
            <div className="space-y-6 animate-fadeIn">
                {/* Header / Plan Status */}
                <div className="flex items-center justify-between bg-white/60 p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Daily Plan: {new Date(dailyPlan.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${dailyPlan.dayType === 'Normal' ? 'bg-slate-200 text-slate-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                    {dailyPlan.dayType}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-sm text-slate-600 font-medium">Expected: {dailyPlan.expectedDevotees.toLocaleString()} Devotees</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isLocked ? 'bg-green-50 border-green-200 text-green-700' : 'bg-soft-white border-harvest-yellow/30 text-harvest-yellow'
                            }`}>
                            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            <span className="text-sm font-bold uppercase">{dailyPlan.status}</span>
                        </div>
                        {!isLocked && (
                            <button
                                onClick={() => setShowApproveModal(true)}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Approve Plan
                            </button>
                        )}
                    </div>
                </div>

                {/* Plan Items Table */}
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/20 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Planned Production Items</h3>
                        {!isLocked && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        )}
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/40 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Item Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-right">Target Quantity</th>
                                <th className="p-4 text-right">Est. Batches</th>
                                {!isLocked && <th className="p-4 w-10"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {dailyPlan.plannedItems.map((item) => (
                                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                                    <td className="p-4 font-bold text-slate-900">{item.recipeName}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-700">
                                        {item.targetQuantity} {item.unit}
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-700">
                                        {item.batchCount}
                                    </td>
                                    {!isLocked && (
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setDeleteItemId(item.id)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Note */}
                {!isLocked && (
                    <div className="bg-soft-white border border-harvest-yellow/30 rounded-lg p-4 text-sm text-harvest-yellow flex items-start gap-3">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Approval Required</p>
                            <p>Production cannot begin until this plan is approved by the Temple Executive or Head Priest. Once approved, quantities are locked.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Item Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Menu Item">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Recipe</label>
                        <select
                            value={formData.recipeId}
                            onChange={(e) => {
                                const recipe = mockRecipes.find(r => r.id === e.target.value);
                                if (recipe) {
                                    setFormData({
                                        ...formData,
                                        recipeId: recipe.id,
                                        recipeName: recipe.name
                                    });
                                }
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a recipe...</option>
                            {mockRecipes.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Prasad">Prasad</option>
                            <option value="Annadanam">Annadanam</option>
                            <option value="Naivedya">Naivedya</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Target Quantity</label>
                            <input
                                type="number"
                                value={formData.targetQuantity}
                                onChange={(e) => setFormData({ ...formData, targetQuantity: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="kg">kg</option>
                                <option value="pcs">pcs</option>
                                <option value="liters">liters</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleAddItem}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Item
                        </button>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Approve Plan Modal */}
            <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Approve Daily Plan">
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            You are about to approve the daily plan for <strong>{dailyPlan.plannedItems.length} items</strong>.
                            Once approved, the plan will be locked and production can begin.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleApprove}
                            className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            Approve Plan
                        </button>
                        <button
                            onClick={() => setShowApproveModal(false)}
                            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteItemId !== null}
                onClose={() => setDeleteItemId(null)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-700">
                        Are you sure you want to remove this item from the plan?
                    </p>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => deleteItemId && handleDelete(deleteItemId)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setDeleteItemId(null)}
                            className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
