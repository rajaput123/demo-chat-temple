'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    maxSizeMB?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10, maxSizeMB = 5 }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploadError(null);
        const newImages: string[] = [];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        Array.from(files).forEach((file) => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setUploadError(`File ${file.name} is not an image`);
                return;
            }

            // Check file size
            if (file.size > maxSizeBytes) {
                setUploadError(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
                return;
            }

            // Check total images limit
            if (images.length + newImages.length >= maxImages) {
                setUploadError(`Maximum ${maxImages} images allowed`);
                return;
            }

            // Convert to base64 or object URL
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                newImages.push(result);
                
                if (newImages.length === Array.from(files).length || images.length + newImages.length >= maxImages) {
                    onImagesChange([...images, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragging
                        ? 'border-cane-green bg-soft-white'
                        : 'border-neutral-300 hover:border-cane-green hover:bg-neutral-50'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-cane-green/10' : 'bg-neutral-100'}`}>
                        <Upload size={24} className={isDragging ? 'text-cane-green' : 'text-neutral-600'} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-900">
                            {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                            PNG, JPG, GIF up to {maxSizeMB}MB (max {maxImages} images)
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">{uploadError}</p>
                </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div>
                    <h4 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        Uploaded Images ({images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                                    <img
                                        src={image}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white rounded text-[10px] font-medium">
                                        {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

