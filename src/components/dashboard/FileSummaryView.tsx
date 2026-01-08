import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { UploadedFile } from '@/types/fileUpload';

interface FileSummaryViewProps {
    file: UploadedFile;
}

export default function FileSummaryView({ file }: FileSummaryViewProps) {
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatTimeAgo = (timestamp: string): string => {
        const now = new Date();
        const uploaded = new Date(timestamp);
        const diffMs = now.getTime() - uploaded.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);

        if (diffSecs < 60) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        return uploaded.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="space-y-4">
            {/* File Info Header */}
            <div className="flex items-start gap-3 p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/30 rounded-lg">
                <div className="p-2 bg-cane-green/10 rounded-lg shrink-0">
                    <FileText size={20} className="text-cane-green/80" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-900 truncate">{file.name}</h4>
                        {file.status === 'completed' && (
                            <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(file.uploadedAt)}</span>
                    </div>
                    {file.status === 'completed' && (
                        <div>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                Uploaded successfully
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Content Summary */}
            {file.summary && (
                <div className="p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/30 rounded-lg">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Content Summary</h5>
                    <p className="text-sm text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                        {file.summary}
                    </p>
                </div>
            )}
        </div>
    );
}

