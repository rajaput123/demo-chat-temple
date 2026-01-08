import React, { useState } from 'react';
import { Clock, Users, IndianRupee, Calendar, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight as ChevronRightIcon, Image as ImageIcon } from 'lucide-react';
import { Seva, Darshan, SevaBooking, DarshanEntry } from '@/types/seva';
import Modal from '@/components/shared/Modal';
import ImageUpload from '@/components/shared/ImageUpload';
import { useSevas } from '@/hooks/useSevas';

// Mock data for Seva
const mockSevas: Seva[] = [
    {
        id: 'seva-001',
        name: 'Archana',
        type: 'archana',
        description: 'Recitation of divine names and mantras',
        templeId: 'temple-001',
        duration: 30,
        price: 100,
        maxParticipants: 5,
        isActive: true,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        availableTimeSlots: ['06:00 AM', '09:00 AM', '12:00 PM', '06:00 PM'],
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
        id: 'seva-002',
        name: 'Abhishekam',
        type: 'abhishekam',
        description: 'Sacred bath ceremony for the deity',
        templeId: 'temple-001',
        duration: 60,
        price: 500,
        maxParticipants: 10,
        isActive: true,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['06:00 AM', '09:00 AM'],
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
        id: 'seva-003',
        name: 'Laksharchana',
        type: 'puja',
        description: 'Special puja with 100,000 chants',
        templeId: 'temple-001',
        duration: 120,
        price: 2000,
        maxParticipants: 20,
        isActive: true,
        availableDays: ['Sunday'],
        availableTimeSlots: ['09:00 AM'],
        images: [
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'seva-004',
        name: 'Rudrabhishekam',
        type: 'homam',
        description: 'Vedic fire ceremony for Lord Shiva',
        templeId: 'temple-003',
        duration: 90,
        price: 1500,
        maxParticipants: 15,
        isActive: true,
        availableDays: ['Monday'],
        availableTimeSlots: ['06:00 AM'],
        images: [
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
];

// Mock data for Darshan
const mockDarshans: Darshan[] = [
    {
        id: 'darshan-001',
        name: 'Free Darshan',
        type: 'free',
        templeId: 'temple-002',
        price: 0,
        duration: 5,
        queueCapacity: 500,
        currentQueueLength: 120,
        isActive: true,
        availableTimeSlots: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'darshan-002',
        name: 'Quick Darshan',
        type: 'paid',
        templeId: 'temple-002',
        price: 50,
        duration: 3,
        queueCapacity: 200,
        currentQueueLength: 45,
        isActive: true,
        availableTimeSlots: ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'darshan-003',
        name: 'VIP Darshan',
        type: 'vip',
        templeId: 'temple-002',
        price: 500,
        duration: 10,
        queueCapacity: 50,
        currentQueueLength: 8,
        isActive: true,
        availableTimeSlots: ['09:00 AM', '12:00 PM', '06:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'darshan-004',
        name: 'Special Darshan',
        type: 'special',
        templeId: 'temple-002',
        price: 1000,
        duration: 15,
        queueCapacity: 30,
        currentQueueLength: 5,
        isActive: true,
        availableTimeSlots: ['09:00 AM', '06:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
];

// Mock data for Seva Bookings
const mockSevaBookings: SevaBooking[] = [
    {
        id: 'booking-001',
        sevaId: 'seva-001',
        templeId: 'temple-001',
        devoteeName: 'Ramesh Kumar',
        devoteePhone: '+91 98765 43210',
        devoteeEmail: 'ramesh.kumar@example.com',
        bookingDate: new Date().toISOString().split('T')[0],
        timeSlot: '09:00 AM',
        numberOfParticipants: 3,
        totalAmount: 100,
        status: 'booked',
        paymentStatus: 'paid',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'booking-002',
        sevaId: 'seva-002',
        templeId: 'temple-001',
        devoteeName: 'Priya Sharma',
        devoteePhone: '+91 98765 43211',
        bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        timeSlot: '06:00 AM',
        numberOfParticipants: 5,
        totalAmount: 500,
        status: 'booked',
        paymentStatus: 'paid',
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
];

// Mock data for Darshan Entries
const mockDarshanEntries: DarshanEntry[] = [
    {
        id: 'entry-001',
        darshanId: 'darshan-001',
        templeId: 'temple-002',
        devoteeName: 'Anonymous Devotee',
        entryTime: new Date().toISOString(),
        status: 'in-queue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
    },
    {
        id: 'entry-002',
        darshanId: 'darshan-002',
        templeId: 'temple-002',
        devoteeName: 'Vikram Reddy',
        entryTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        status: 'in-progress',
        tokenNumber: 'QD-045',
        amount: 50,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
    },
    {
        id: 'entry-003',
        darshanId: 'darshan-003',
        templeId: 'temple-002',
        devoteeName: 'Anjali Patel',
        entryTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        exitTime: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
        status: 'completed',
        tokenNumber: 'VIP-008',
        amount: 500,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3000000).toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
    },
];

const SevaDetailsModal = ({ seva, isOpen, onClose, onUpdateImages }: { seva: Seva | null; isOpen: boolean; onClose: () => void; onUpdateImages: (sevaId: string, images: string[]) => void }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'details' | 'images'>('details');
    const [images, setImages] = useState<string[]>([]);

    React.useEffect(() => {
        if (seva) {
            setImages(seva.images || []);
            setSelectedImageIndex(0);
        }
    }, [seva]);

    if (!seva) return null;

    const nextImage = () => {
        if (images.length > 0) {
            setSelectedImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const handleImagesChange = (newImages: string[]) => {
        setImages(newImages);
        onUpdateImages(seva.id, newImages);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={seva.name} size="xl">
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
                            alt={seva.name}
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
                                    alt={`${seva.name} ${idx + 1}`}
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
                        <p className="text-base text-neutral-900 font-medium">{seva.description || 'No description available'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Type</h3>
                            <span className="px-3 py-1 bg-cane-green/10 text-cane-green/80 rounded text-sm font-bold uppercase">
                                {seva.type}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Price</h3>
                            <div className="flex items-center gap-2 text-base text-neutral-900 font-medium">
                                <IndianRupee size={16} className="text-cane-green" />
                                <span className="font-bold text-cane-green">₹{seva.price}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Duration</h3>
                            <div className="flex items-center gap-2 text-base text-neutral-900 font-medium">
                                <Clock size={16} className="text-cane-green" />
                                <span>{seva.duration} minutes</span>
                            </div>
                        </div>

                        {seva.maxParticipants && (
                            <div>
                                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Max Participants</h3>
                                <div className="flex items-center gap-2 text-base text-neutral-900 font-medium">
                                    <Users size={16} className="text-cane-green" />
                                    <span>{seva.maxParticipants} people</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {seva.availableDays && seva.availableDays.length > 0 && (
                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Available Days</h3>
                            <div className="flex flex-wrap gap-2">
                                {seva.availableDays.map((day) => (
                                    <span key={day} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded text-sm font-medium">
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {seva.availableTimeSlots && seva.availableTimeSlots.length > 0 && (
                        <div>
                            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Available Time Slots</h3>
                            <div className="flex flex-wrap gap-2">
                                {seva.availableTimeSlots.map((slot) => (
                                    <span key={slot} className="px-3 py-1 bg-cane-green/10 text-cane-green/80 rounded text-sm font-medium">
                                        {slot}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Status</h3>
                        {seva.isActive ? (
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

export default function SevaDarshanManagement() {
    const [activeTab, setActiveTab] = useState<'seva' | 'darshan' | 'bookings' | 'entries'>('seva');
    const { sevas, updateSevaImages } = useSevas(mockSevas);
    const [darshans] = useState<Darshan[]>(mockDarshans);
    const [sevaBookings] = useState<SevaBooking[]>(mockSevaBookings);
    const [darshanEntries] = useState<DarshanEntry[]>(mockDarshanEntries);
    const [selectedSeva, setSelectedSeva] = useState<Seva | null>(null);
    const [isSevaDetailsModalOpen, setIsSevaDetailsModalOpen] = useState(false);

    const handleUpdateSevaImages = (sevaId: string, images: string[]) => {
        updateSevaImages(sevaId, images);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { bg: string; text: string; icon: any } } = {
            'available': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            'booked': { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle },
            'completed': { bg: 'bg-cane-green/10', text: 'text-cane-green/80', icon: CheckCircle },
            'cancelled': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
            'in-queue': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle },
            'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
        };

        const config = statusConfig[status] || { bg: 'bg-neutral-100', text: 'text-neutral-700', icon: AlertCircle };
        const Icon = config.icon;

        return (
            <span className={`px-2 py-1 ${config.bg} ${config.text} rounded text-[10px] font-bold uppercase flex items-center gap-1`}>
                <Icon size={12} />
                {status}
            </span>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Seva & Darshan Management</h2>
                    <p className="text-sm text-neutral-500 font-medium">Unified service and viewing coordination</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-neutral-200">
                {(['seva', 'darshan', 'bookings', 'entries'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                            activeTab === tab
                                ? 'text-industrial-gray border-b-2 border-industrial-gray'
                                : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                    >
                        {tab === 'seva' ? 'Seva Services' : tab === 'darshan' ? 'Darshan Types' : tab === 'bookings' ? 'Seva Bookings' : 'Darshan Entries'}
                    </button>
                ))}
            </div>

            {/* Seva Tab */}
            {activeTab === 'seva' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Available Seva Services</h3>
                        <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all">
                            Add Seva
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sevas.map((seva) => (
                            <div
                                key={seva.id}
                                onClick={() => {
                                    setSelectedSeva(seva);
                                    setIsSevaDetailsModalOpen(true);
                                }}
                                className="p-5 rounded-lg border border-neutral-200/30 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all cursor-pointer"
                            >
                                {/* Image Preview */}
                                {seva.images && seva.images.length > 0 && (
                                    <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-neutral-100">
                                        <img
                                            src={seva.images[0]}
                                            alt={seva.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 text-white rounded text-[10px] font-medium">
                                            <ImageIcon size={12} />
                                            <span>{seva.images.length}</span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="text-base font-black text-slate-900 mb-1">{seva.name}</h4>
                                        <span className="px-2 py-0.5 bg-cane-green/10 text-cane-green/80 rounded text-[10px] font-bold uppercase">
                                            {seva.type}
                                        </span>
                                    </div>
                                    {seva.isActive ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                {seva.description && (
                                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{seva.description}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        <span>{seva.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <IndianRupee size={14} />
                                        <span className="font-bold text-cane-green">₹{seva.price}</span>
                                    </div>
                                    {seva.maxParticipants && (
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} />
                                            <span>Max {seva.maxParticipants}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Darshan Tab */}
            {activeTab === 'darshan' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Darshan Types</h3>
                        <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all">
                            Add Darshan
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {darshans.map((darshan) => {
                            const queuePercentage = darshan.queueCapacity && darshan.currentQueueLength
                                ? Math.round((darshan.currentQueueLength / darshan.queueCapacity) * 100)
                                : 0;

                            return (
                                <div key={darshan.id} className="p-5 rounded-lg border border-neutral-200/30 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="text-base font-black text-slate-900 mb-1">{darshan.name}</h4>
                                            <span className="px-2 py-0.5 bg-cane-green/10 text-cane-green/80 rounded text-[10px] font-bold uppercase">
                                                {darshan.type}
                                            </span>
                                        </div>
                                        {darshan.isActive ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <IndianRupee size={14} />
                                            <span className="font-bold text-cane-green">
                                                {darshan.price === 0 ? 'Free' : `₹${darshan.price}`}
                                            </span>
                                        </div>
                                        {darshan.duration && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                <span>{darshan.duration} min</span>
                                            </div>
                                        )}
                                        {darshan.queueCapacity && (
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} />
                                                <span>
                                                    {darshan.currentQueueLength || 0} / {darshan.queueCapacity}
                                                    {darshan.currentQueueLength && (
                                                        <span className="ml-1 text-cane-green font-bold">
                                                            ({queuePercentage}%)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Seva Bookings Tab */}
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Seva Bookings</h3>
                        <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all">
                            New Booking
                        </button>
                    </div>
                    <div className="space-y-3">
                        {sevaBookings.map((booking) => {
                            const seva = sevas.find(s => s.id === booking.sevaId);
                            return (
                                <div key={booking.id} className="p-4 rounded-lg border border-neutral-200/30 bg-white/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-base font-black text-slate-900">{booking.devoteeName}</h4>
                                            <p className="text-sm text-neutral-600">{seva?.name}</p>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-3">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <span>{booking.timeSlot}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} />
                                            <span>{booking.numberOfParticipants} participants</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <IndianRupee size={14} />
                                            <span className="font-bold text-cane-green">₹{booking.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Darshan Entries Tab */}
            {activeTab === 'entries' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Darshan Entries</h3>
                    </div>
                    <div className="space-y-3">
                        {darshanEntries.map((entry) => {
                            const darshan = darshans.find(d => d.id === entry.darshanId);
                            return (
                                <div key={entry.id} className="p-4 rounded-lg border border-neutral-200/30 bg-white/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-base font-black text-slate-900">{entry.devoteeName || 'Anonymous'}</h4>
                                            <p className="text-sm text-neutral-600">{darshan?.name}</p>
                                        </div>
                                        {getStatusBadge(entry.status)}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-3">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <span>Entry: {new Date(entry.entryTime).toLocaleTimeString()}</span>
                                        </div>
                                        {entry.exitTime && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                <span>Exit: {new Date(entry.exitTime).toLocaleTimeString()}</span>
                                            </div>
                                        )}
                                        {entry.tokenNumber && (
                                            <span className="px-2 py-0.5 bg-cane-green/10 text-cane-green/80 rounded text-[10px] font-bold">
                                                Token: {entry.tokenNumber}
                                            </span>
                                        )}
                                        {entry.amount && (
                                            <div className="flex items-center gap-1.5">
                                                <IndianRupee size={14} />
                                                <span className="font-bold text-cane-green">₹{entry.amount}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Seva Details Modal */}
            <SevaDetailsModal
                seva={selectedSeva}
                isOpen={isSevaDetailsModalOpen}
                onClose={() => setIsSevaDetailsModalOpen(false)}
                onUpdateImages={handleUpdateSevaImages}
            />
        </div>
    );
}
