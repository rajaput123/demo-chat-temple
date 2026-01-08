/**
 * Mock Data for VIP Management
 * 
 * Realistic VIP data for Sringeri Sharada Peetham
 * Note: VIP visits are already handled in types/vip.ts, this adds profile data
 */

import { VIPVisit, VIPProtocolLevel } from '@/types/vip';

export interface VIPProfile {
    id: string;
    name: string;
    title?: string;
    designation?: string;
    organization?: string;
    email?: string;
    phone?: string;
    address?: string;
    protocolLevel: VIPProtocolLevel;
    preferences: {
        accommodation?: string;
        dietary?: string[];
        specialRequests?: string;
    };
    visitHistory: string[]; // Array of visit IDs
    relationshipNotes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VIPRelationship {
    id: string;
    vipId: string;
    contactPerson: string;
    relationshipType: 'primary' | 'secondary' | 'liaison';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const mockVIPProfiles: VIPProfile[] = [
    {
        id: 'vip-001',
        name: 'Narendra Modi',
        title: 'Prime Minister',
        designation: 'Prime Minister of India',
        organization: 'Government of India',
        protocolLevel: 'maximum',
        preferences: {
            accommodation: 'VIP Guest House',
            dietary: ['Vegetarian', 'Satvik'],
            specialRequests: 'High security protocol required',
        },
        visitHistory: ['visit-001'],
        relationshipNotes: 'Regular visitor, strong devotee connection',
        isActive: true,
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vip-002',
        name: 'Basavaraj Bommai',
        title: 'Former Chief Minister',
        designation: 'Former Chief Minister of Karnataka',
        organization: 'Government of Karnataka',
        protocolLevel: 'high',
        preferences: {
            accommodation: 'VIP Guest House',
            dietary: ['Vegetarian'],
        },
        visitHistory: [],
        relationshipNotes: 'State government liaison',
        isActive: true,
        createdAt: '2023-06-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vip-003',
        name: 'Dr. Ramesh Aravind',
        title: 'Actor',
        designation: 'Film Actor and Philanthropist',
        protocolLevel: 'standard',
        preferences: {
            dietary: ['Vegetarian'],
        },
        visitHistory: [],
        relationshipNotes: 'Cultural ambassador, regular supporter',
        isActive: true,
        createdAt: '2023-08-20T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vip-004',
        name: 'N. R. Narayana Murthy',
        title: 'Founder',
        designation: 'Founder, Infosys',
        organization: 'Infosys',
        protocolLevel: 'high',
        preferences: {
            accommodation: 'VIP Guest House',
            dietary: ['Vegetarian', 'Simple'],
        },
        visitHistory: [],
        relationshipNotes: 'Major donor, technology advisor',
        isActive: true,
        createdAt: '2022-12-05T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

export const mockVIPRelationships: VIPRelationship[] = [
    {
        id: 'rel-001',
        vipId: 'vip-001',
        contactPerson: 'Security Liaison Officer',
        relationshipType: 'primary',
        notes: 'Primary contact for security and protocol arrangements',
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'rel-002',
        vipId: 'vip-002',
        contactPerson: 'Personal Secretary',
        relationshipType: 'primary',
        notes: 'Main point of contact for visit coordination',
        createdAt: '2023-06-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'rel-003',
        vipId: 'vip-004',
        contactPerson: 'Executive Assistant',
        relationshipType: 'primary',
        notes: 'Coordinates visits and philanthropic activities',
        createdAt: '2022-12-05T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

