import React, { useState } from 'react';
import { Building2, MapPin, Users, Clock, ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon, Image as ImageIcon } from 'lucide-react';
import { Temple, TempleHierarchy } from '@/types/temple';
import Modal from '@/components/shared/Modal';
import ImageUpload from '@/components/shared/ImageUpload';
import { useTemples } from '@/hooks/useTemples';

// Mock data for temples with hierarchy
const mockTemples: Temple[] = [
    {
        id: 'temple-001',
        name: 'Sringeri Sharada Peetham',
        code: 'MAIN',
        parentTempleId: null,
        location: 'Sringeri, Karnataka',
        description: 'Main temple complex and headquarters',
        isActive: true,
        capacity: 5000,
        currentOccupancy: 1200,
        openingTime: '06:00 AM',
        closingTime: '09:00 PM',
        images: [
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'temple-002',
        name: 'Sharada Temple',
        code: 'SHRD',
        parentTempleId: 'temple-001',
        location: 'Sringeri, Karnataka',
        description: 'Main sanctum of Goddess Sharada',
        isActive: true,
        capacity: 200,
        currentOccupancy: 45,
        openingTime: '06:00 AM',
        closingTime: '09:00 PM',
        images: [
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'temple-003',
        name: 'Vidyashankara Temple',
        code: 'VIDY',
        parentTempleId: 'temple-001',
        location: 'Sringeri, Karnataka',
        description: 'Ancient temple dedicated to Lord Shiva',
        isActive: true,
        capacity: 150,
        currentOccupancy: 30,
        openingTime: '06:00 AM',
        closingTime: '08:00 PM',
        images: [
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'temple-004',
        name: 'Malnad Branch Temple',
        code: 'MALN',
        parentTempleId: 'temple-001',
        location: 'Malnad, Karnataka',
        description: 'Branch temple in Malnad region',
        isActive: true,
        capacity: 300,
        currentOccupancy: 80,
        openingTime: '07:00 AM',
        closingTime: '08:00 PM',
        images: [
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'temple-005',
        name: 'Bangalore Branch Temple',
        code: 'BLR',
        parentTempleId: 'temple-001',
        location: 'Bangalore, Karnataka',
        description: 'Urban branch temple in Bangalore',
        isActive: true,
        capacity: 800,
        currentOccupancy: 250,
        openingTime: '06:30 AM',
        closingTime: '09:30 PM',
        images: [
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
];

// Build hierarchy from flat list
const buildHierarchy = (temples: Temple[]): TempleHierarchy[] => {
    const templeMap = new Map<string, TempleHierarchy>();
    const roots: TempleHierarchy[] = [];

    // Create map of all temples
    temples.forEach(temple => {
        templeMap.set(temple.id, {
            ...temple,
            children: [],
            level: 0,
        });
    });

    // Build hierarchy
    temples.forEach(temple => {
        const templeNode = templeMap.get(temple.id)!;
        if (temple.parentTempleId) {
            const parent = templeMap.get(temple.parentTempleId);
            if (parent) {
                parent.children.push(templeNode);
                templeNode.level = parent.level + 1;
            } else {
                roots.push(templeNode);
            }
        } else {
            roots.push(templeNode);
        }
    });

    return roots;
};

const TempleNode = ({ temple, level = 0, onViewDetails }: { temple: TempleHierarchy; level?: number; onViewDetails: (temple: Temple) => void }) => {
    const [isExpanded, setIsExpanded] = useState(level === 0);

    const occupancyPercentage = temple.capacity && temple.currentOccupancy
        ? Math.round((temple.currentOccupancy / temple.capacity) * 100)
        : 0;

    return (
        <div className="mb-2">
            <div
                onClick={() => onViewDetails(temple)}
                className={`p-4 rounded-lg border border-neutral-200/30 bg-white/40 backdrop-blur-sm transition-all hover:bg-white/60 hover:border-neutral-200/50 cursor-pointer ${
                    level > 0 ? 'ml-6' : ''
                }`}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {temple.children.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(!isExpanded);
                                    }}
                                    className="p-1 hover:bg-neutral-100 rounded transition-colors"
                                >
                                    {isExpanded ? (
                                        <ChevronDown size={16} className="text-neutral-600" />
                                    ) : (
                                        <ChevronRight size={16} className="text-neutral-600" />
                                    )}
                                </button>
                            )}
                            <Building2 size={18} className="text-cane-green" />
                            <h3 className="text-base font-black text-slate-900">{temple.name}</h3>
                            <span className="px-2 py-0.5 bg-cane-green/10 text-cane-green/80 rounded text-[10px] font-bold uppercase">
                                {temple.code}
                            </span>
                        </div>

                        <div className="ml-8 space-y-2">
                            {temple.description && (
                                <p className="text-sm text-neutral-600 font-medium">{temple.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    <span>{temple.location}</span>
                                </div>
                                {temple.openingTime && temple.closingTime && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>{temple.openingTime} - {temple.closingTime}</span>
                                    </div>
                                )}
                                {temple.capacity && (
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} />
                                        <span>
                                            {temple.currentOccupancy || 0} / {temple.capacity}
                                            {temple.currentOccupancy && (
                                                <span className="ml-1 text-cane-green font-bold">
                                                    ({occupancyPercentage}%)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {temple.isActive ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                Active
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase">
                                Inactive
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && temple.children.length > 0 && (
                <div className="mt-2 space-y-2">
                    {temple.children.map((child) => (
                        <TempleNode key={child.id} temple={child} level={level + 1} onViewDetails={onViewDetails} />
                    ))}
                </div>
            )}
        </div>
    );
};

const TempleDetailsModal = ({ temple, isOpen, onClose, onUpdateImages }: { temple: Temple | null; isOpen: boolean; onClose: () => void; onUpdateImages: (templeId: string, images: string[]) => void }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'details' | 'images'>('details');
    const [images, setImages] = useState<string[]>([]);

    React.useEffect(() => {
        if (temple) {
            setImages(temple.images || []);
            setSelectedImageIndex(0);
        }
    }, [temple]);

    if (!temple) return null;

    const occupancyPercentage = temple.capacity && temple.currentOccupancy
        ? Math.round((temple.currentOccupancy / temple.capacity) * 100)
        : 0;

    const handleImagesChange = (newImages: string[]) => {
        setImages(newImages);
        onUpdateImages(temple.id, newImages);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={temple.name} size="xl">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-neutral-200 mb-6 -mt-2 -mx-6 px-6">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                        activeTab === 'details'
                            ? 'text-industrial-gray border-industrial-gray'
                            : 'text-neutral-500 hover:text-neutral-700 border-transparent'
                    }`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveTab('images')}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
                        activeTab === 'images'
                            ? 'text-industrial-gray border-industrial-gray'
                            : 'text-neutral-500 hover:text-neutral-700 border-transparent'
                    }`}
                >
                    <ImageIcon size={16} />
                    Images ({images.length})
                </button>
            </div>

            <div className="space-y-6">
                {/* Images Tab */}
                {activeTab === 'images' && (
                    <ImageUpload
                        images={images}
                        onImagesChange={handleImagesChange}
                        maxImages={10}
                        maxSizeMB={5}
                    />
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <>
                        {/* Main Image */}
                        {images.length > 0 && (
                    <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden bg-neutral-100">
                        <img
                            src={images[selectedImageIndex]}
                            alt={temple.name}
                            className="w-full h-full object-cover"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                                >
                                    <ChevronRightIcon size={20} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                idx === selectedImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Image Gallery */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                    idx === selectedImageIndex ? 'border-cane-green' : 'border-transparent hover:border-neutral-300'
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${temple.name} ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Details */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Description</h3>
                        <p className="text-base text-neutral-900 font-medium">{temple.description || 'No description available'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Location</h3>
                            <div className="flex items-center gap-2 text-base text-neutral-900 font-medium">
                                <MapPin size={16} className="text-cane-green" />
                                <span>{temple.location}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Code</h3>
                            <span className="px-3 py-1 bg-cane-green/10 text-cane-green/80 rounded text-sm font-bold uppercase">
                                {temple.code}
                            </span>
                        </div>

                        {temple.openingTime && temple.closingTime && (
                            <div>
                                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Timings</h3>
                                <div className="flex items-center gap-2 text-base text-neutral-900 font-medium">
                                    <Clock size={16} className="text-cane-green" />
                                    <span>{temple.openingTime} - {temple.closingTime}</span>
                                </div>
                            </div>
                        )}

                        {temple.capacity && (
                            <div>
                                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Capacity</h3>
                                <div className="flex items-center gap-2 text-base text-neutral-900 font-medium">
                                    <Users size={16} className="text-cane-green" />
                                    <span>
                                        {temple.currentOccupancy || 0} / {temple.capacity}
                                        {temple.currentOccupancy && (
                                            <span className="ml-2 text-cane-green font-bold">
                                                ({occupancyPercentage}%)
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Status</h3>
                        {temple.isActive ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-bold uppercase">
                                Active
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded text-sm font-bold uppercase">
                                Inactive
                            </span>
                        )}
                    </div>
                </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default function TempleManagement() {
    const { temples, updateTempleImages } = useTemples(mockTemples);
    const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const templeHierarchy = buildHierarchy(temples);

    const handleViewDetails = (temple: Temple) => {
        setSelectedTemple(temple);
        setIsDetailsModalOpen(true);
    };

    const handleUpdateImages = (templeId: string, images: string[]) => {
        updateTempleImages(templeId, images);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Temple Management</h2>
                    <p className="text-sm text-neutral-500 font-medium">Infrastructure and sacred space management with temple hierarchy</p>
                </div>
                <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all">
                    Add Temple
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Temple Hierarchy</h3>
                    <span className="text-xs text-neutral-500 font-medium">
                        {temples.length} {temples.length === 1 ? 'Temple' : 'Temples'}
                    </span>
                </div>

                <div className="space-y-3">
                    {templeHierarchy.map((temple) => (
                        <TempleNode key={temple.id} temple={temple} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            </div>

            <TempleDetailsModal
                temple={selectedTemple}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                onUpdateImages={handleUpdateImages}
            />
        </div>
    );
}
