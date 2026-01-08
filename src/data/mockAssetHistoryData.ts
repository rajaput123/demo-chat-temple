/**
 * Mock Data for Asset History & Memory
 * 
 * Realistic historical data for Sringeri Sharada Peetham
 */

export interface AssetHistory {
    id: string;
    assetId: string;
    eventType: 'acquisition' | 'donation' | 'transfer' | 'maintenance' | 'valuation' | 'disposal' | 'other';
    eventDate: string;
    description: string;
    performedBy?: string;
    documents?: string[];
    images?: string[];
    notes?: string;
    createdAt: string;
    createdBy: string;
}

export interface ArchivalMedia {
    id: string;
    assetId: string;
    mediaType: 'photo' | 'video' | 'document' | 'audio';
    title: string;
    description?: string;
    mediaUrl: string;
    date: string;
    archivedBy: string;
    createdAt: string;
}

export const mockAssetHistory: AssetHistory[] = [
    {
        id: 'hist-001',
        assetId: 'asset-001',
        eventType: 'acquisition',
        eventDate: '1950-01-01',
        description: 'Original acquisition of gold murti of Goddess Sharada',
        performedBy: 'admin',
        documents: ['/documents/history/gold-murti-acquisition.pdf'],
        notes: 'Sacred murti acquired during temple establishment',
        createdAt: '1950-01-01T10:00:00Z',
        createdBy: 'admin',
    },
    {
        id: 'hist-002',
        assetId: 'asset-001',
        eventType: 'donation',
        eventDate: '2020-05-15',
        description: 'Major restoration and enhancement of gold murti',
        performedBy: 'emp-004',
        documents: ['/documents/history/murti-restoration-2020.pdf'],
        images: ['/images/history/murti-restoration-before.jpg', '/images/history/murti-restoration-after.jpg'],
        notes: 'Comprehensive restoration work completed by expert artisans',
        createdAt: '2020-05-15T10:00:00Z',
        createdBy: 'emp-004',
    },
    {
        id: 'hist-003',
        assetId: 'asset-003',
        eventType: 'acquisition',
        eventDate: '1950-01-01',
        description: 'Original construction of main temple building',
        performedBy: 'admin',
        documents: ['/documents/history/temple-construction.pdf'],
        images: ['/images/history/temple-construction-1950.jpg'],
        notes: 'Main temple building constructed as part of peetham establishment',
        createdAt: '1950-01-01T10:00:00Z',
        createdBy: 'admin',
    },
    {
        id: 'hist-004',
        assetId: 'asset-002',
        eventType: 'donation',
        eventDate: '2020-05-15',
        description: 'Silver thali set donated by devotee family',
        performedBy: 'emp-004',
        documents: ['/documents/history/silver-thali-donation.pdf'],
        notes: 'Generous donation of silver aarti thali set for temple rituals',
        createdAt: '2020-05-15T10:00:00Z',
        createdBy: 'emp-004',
    },
];

export const mockArchivalMedia: ArchivalMedia[] = [
    {
        id: 'arch-001',
        assetId: 'asset-001',
        mediaType: 'photo',
        title: 'Gold Murti - Original Installation 1950',
        description: 'Historical photograph of gold murti installation',
        mediaUrl: '/images/archive/murti-installation-1950.jpg',
        date: '1950-01-01',
        archivedBy: 'admin',
        createdAt: '1950-01-01T10:00:00Z',
    },
    {
        id: 'arch-002',
        assetId: 'asset-003',
        mediaType: 'photo',
        title: 'Temple Construction - 1950',
        description: 'Historical photograph of temple construction',
        mediaUrl: '/images/archive/temple-construction-1950.jpg',
        date: '1950-01-01',
        archivedBy: 'admin',
        createdAt: '1950-01-01T10:00:00Z',
    },
    {
        id: 'arch-003',
        assetId: 'asset-001',
        mediaType: 'video',
        title: 'Gold Murti Restoration Process - 2020',
        description: 'Documentary video of murti restoration process',
        mediaUrl: '/videos/archive/murti-restoration-2020.mp4',
        date: '2020-05-15',
        archivedBy: 'emp-004',
        createdAt: '2020-05-15T10:00:00Z',
    },
];

