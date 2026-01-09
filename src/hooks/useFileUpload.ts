/**
 * File Upload Hook
 * 
 * Handles PDF file upload, extraction, and progress tracking.
 * Extracted from RightPane for better separation of concerns.
 */

import { useState, useRef, useEffect } from 'react';
import { UploadedFile } from '@/types/fileUpload';
import { PDFExtractor } from '@/utils/pdfExtractor';

export function useFileUpload(onFileUploaded?: (file: UploadedFile) => void) {
    const [uploadingFile, setUploadingFile] = useState<UploadedFile | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateUpload = (file: File, onProgress: (progress: number) => void, onComplete: (uploadedFile: UploadedFile) => void) => {
        const duration = Math.random() * 10000 + 10000; // 10-20 seconds
        const interval = 100; // Update every 100ms
        const steps = duration / interval;
        const increment = 100 / steps;

        let currentProgress = 0;
        const timer = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(timer);

                const uploadedFile: UploadedFile = {
                    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString(),
                    status: 'completed',
                    uploadProgress: 100,
                };

                onComplete(uploadedFile);
            } else {
                onProgress(currentProgress);
            }
        }, interval);

        uploadTimerRef.current = timer;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/pdf') {
            return;
        }

        // Create uploading file object
        const newUploadingFile: UploadedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            status: 'uploading',
            uploadProgress: 0,
        };

        setUploadingFile(newUploadingFile);
        setUploadProgress(0);
        setShowSuccess(false);

        // Extract PDF content and generate summary
        let extractedContent = '';
        let summary = '';
        
        try {
            const { content, summary: generatedSummary } = await PDFExtractor.extractAndSummarize(file);
            extractedContent = content;
            summary = generatedSummary;
        } catch (error) {
            console.error('Error extracting PDF content:', error);
            // Continue with empty content if extraction fails
        }

        // Start simulated upload
        simulateUpload(
            file,
            (progress) => {
                setUploadProgress(progress);
                setUploadingFile(prev => prev ? { ...prev, uploadProgress: progress } : null);
            },
            (uploadedFile) => {
                // Add extracted content and summary to uploaded file
                const fileWithContent: UploadedFile = {
                    ...uploadedFile,
                    content: extractedContent,
                    summary: summary,
                };
                
                setUploadingFile(fileWithContent);
                setUploadProgress(100);
                setShowSuccess(true);

                // Notify parent component
                if (onFileUploaded) {
                    onFileUploaded(fileWithContent);
                }

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                    setUploadingFile(null);
                    setUploadProgress(0);
                }, 3000);
            }
        );

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (uploadTimerRef.current) {
                clearInterval(uploadTimerRef.current);
            }
        };
    }, []);

    return {
        uploadingFile,
        uploadProgress,
        showSuccess,
        fileInputRef,
        handleFileSelect,
        handleUploadClick
    };
}

