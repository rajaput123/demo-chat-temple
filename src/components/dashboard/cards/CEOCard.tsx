/**
 * CEO Card Component
 * 
 * Renders executive/CEO appointment cards with special formatting.
 */

import React from 'react';

interface CEOCardProps {
    cardData: {
        type: string;
        subject: string;
        dateTime: string;
        intent: string;
        plannedBy: string;
        visibility: string;
    };
}

export const CEOCard = React.memo(({ cardData }: CEOCardProps) => {
    return (
        <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white/80">
                    {cardData.type}
                </div>
                <div className="px-2 py-1 bg-earth-500 rounded text-[10px] font-black uppercase tracking-widest text-white">
                    {cardData.visibility} Scope
                </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight mb-2">{cardData.subject}</h3>
            <p className="text-lg text-white/60 font-medium mb-8">{cardData.dateTime}</p>

            <div className="space-y-4 border-t border-white/10 pt-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Executive Intent</p>
                    <p className="text-sm font-medium leading-relaxed text-white/90">{cardData.intent}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                        CEO
                    </div>
                    <p className="text-[10px] font-medium text-white/40">Planned by {cardData.plannedBy}</p>
                </div>
            </div>
        </div>
    );
});

CEOCard.displayName = 'CEOCard';

