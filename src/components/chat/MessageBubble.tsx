/**
 * Message Bubble Component
 * 
 * Renders chat messages with proper styling.
 * Extracted from RightPane and memoized for performance.
 */

import React from 'react';

interface MessageBubbleProps {
    role: 'assistant' | 'user' | 'system';
    text: string;
    isTyping?: boolean;
}

export const MessageBubble = React.memo(({ role, text, isTyping }: MessageBubbleProps) => {
    if (role === 'system') {
        return (
            <div className="flex justify-center my-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                    {text === 'Planning...' && (
                        <span className="flex gap-1">
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                        </span>
                    )}
                    {text}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-1.5 ${role === 'user' ? 'items-end' : 'items-start'} mb-6 animate-fadeIn`}>
            <div className={`text-[11px] font-black uppercase tracking-widest mb-0.5 px-1 ${role === 'user' ? 'text-slate-400' : 'text-slate-900'}`}>
                {role === 'user' ? 'You' : 'Namaha AI'}
            </div>
            <div
                className={`max-w-[90%] px-4 py-3 text-[14px] leading-relaxed font-medium transition-all rounded-[16px] shadow-sm
        ${role === 'user'
                        ? 'bg-earth-900 text-white'
                        : 'bg-white border border-slate-200/60 text-slate-900'
                    }`}
            >
                {text}
                {isTyping && role === 'assistant' && (
                    <span className="ml-1 animate-pulse">|</span>
                )}
            </div>
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

