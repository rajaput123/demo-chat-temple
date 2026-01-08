import React from 'react';
import { ArrowRight, Lock, CheckCircle, DollarSign, XCircle } from 'lucide-react';
import { Asset, AssetLifecycleState } from '@/types/asset';
import { AssetLifecycleService } from '@/services/assetLifecycleService';

interface AssetLifecycleProps {
    asset: Asset;
    onStateChange: (assetId: string, newState: AssetLifecycleState) => void;
    canModify: boolean; // Only Asset Governance module can modify
}

const lifecycleStates: { state: AssetLifecycleState; label: string; icon: React.ReactNode; color: string }[] = [
    { state: 'get', label: 'Acquire', icon: <ArrowRight size={16} />, color: 'bg-blue-100 text-blue-700' },
    { state: 'write', label: 'Register', icon: <CheckCircle size={16} />, color: 'bg-green-100 text-green-700' },
    { state: 'lock', label: 'Lock', icon: <Lock size={16} />, color: 'bg-yellow-100 text-yellow-700' },
    { state: 'use', label: 'Use', icon: <ArrowRight size={16} />, color: 'bg-purple-100 text-purple-700' },
    { state: 'care', label: 'Care', icon: <CheckCircle size={16} />, color: 'bg-indigo-100 text-indigo-700' },
    { state: 'check', label: 'Check', icon: <CheckCircle size={16} />, color: 'bg-cyan-100 text-cyan-700' },
    { state: 'value', label: 'Value', icon: <DollarSign size={16} />, color: 'bg-emerald-100 text-emerald-700' },
    { state: 'close', label: 'Close', icon: <XCircle size={16} />, color: 'bg-neutral-100 text-neutral-700' },
];

export default function AssetLifecycle({ asset, onStateChange, canModify }: AssetLifecycleProps) {
    const currentStateIndex = lifecycleStates.findIndex(s => s.state === asset.lifecycleState);
    const validNextStates = AssetLifecycleService.getValidNextStates(asset.lifecycleState);

    const handleStateChange = (newState: AssetLifecycleState) => {
        if (!canModify) return;
        
        // Validate transition using service
        const result = AssetLifecycleService.transitionAsset(asset, newState, 'current-user');
        if (result.success && result.asset) {
            onStateChange(asset.id, newState);
        } else {
            alert(result.error || 'Invalid transition');
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Asset Lifecycle</h3>
            <p className="text-xs text-neutral-500">Universal lifecycle: {AssetLifecycleService.getLifecycleFlow()}</p>
            
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4">
                {lifecycleStates.map((state, index) => {
                    const isActive = state.state === asset.lifecycleState;
                    const isPast = index < currentStateIndex;
                    const canTransition = validNextStates.includes(state.state) || isPast;
                    const isNext = index === currentStateIndex + 1 && canTransition;

                    return (
                        <React.Fragment key={state.state}>
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => canModify && canTransition && handleStateChange(state.state)}
                                    disabled={!canModify || !canTransition}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        isActive
                                            ? `${state.color} ring-2 ring-cane-green`
                                            : isPast
                                                ? `${state.color} opacity-60`
                                                : isNext && canModify
                                                    ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 cursor-pointer'
                                                    : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
                                    }`}
                                    title={!canTransition && !isPast ? `Cannot transition to ${state.label} from ${asset.lifecycleState}` : ''}
                                >
                                    {state.icon}
                                    <span>{state.label}</span>
                                </button>
                            </div>
                            {index < lifecycleStates.length - 1 && (
                                <ArrowRight size={16} className="text-neutral-300 flex-shrink-0" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {!canModify && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                        Only Asset Governance module can modify asset lifecycle state.
                    </p>
                </div>
            )}
        </div>
    );
}

