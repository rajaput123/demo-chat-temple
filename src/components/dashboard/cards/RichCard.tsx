/**
 * Rich Card Component
 * 
 * Renders VIP, Visit, Event, and Summary cards with highlights.
 */

import React from 'react';

interface Highlight {
    time: string;
    description: string;
}

interface RichCardProps {
    cardData: {
        visitor?: string;
        title: string;
        dateTime: string;
        location?: string;
        protocolLevel?: string;
        delegationSize?: string;
        todayHighlights?: Highlight[];
        highlightTitle?: string;
        highlights?: Highlight[];
    };
    cardType: 'vip' | 'visit' | 'event' | 'summary';
}

export const RichCard = React.memo(({ cardData, cardType }: RichCardProps) => {
    const highlightTitle = cardData.highlightTitle || "TODAY | HIGHLIGHTS";
    const highlights = cardData.todayHighlights || cardData.highlights || [];

    return (
        <div className="p-6 md:p-8 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white animate-fadeIn">
            {highlights.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-white/60 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <span className="text-lg">📅</span> {highlightTitle}
                    </h4>
                    <div className="space-y-4">
                        {highlights.map((highlight, idx) => (
                            <div key={idx} className="flex gap-4">
                                <span className="text-amber-300 font-mono text-sm font-bold whitespace-nowrap pt-0.5">{highlight.time}</span>
                                <span className="text-white/90 text-sm leading-relaxed border-l-2 border-white/10 pl-4">{highlight.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

RichCard.displayName = 'RichCard';

