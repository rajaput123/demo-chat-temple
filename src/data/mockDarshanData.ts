/**
 * Mock Data for Darshan Management
 * 
 * Realistic darshan data for Sringeri Sharada Peetham
 */

import { Darshan, DarshanEntry } from '@/types/seva';

export const mockDarshans: Darshan[] = [
    {
        id: 'darshan-001',
        name: 'Free Darshan',
        type: 'free',
        templeId: 'temple-sharada',
        price: 0,
        duration: 5,
        queueCapacity: 500,
        currentQueueLength: 150,
        isActive: true,
        availableTimeSlots: ['06:00 AM - 09:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'darshan-002',
        name: 'Paid Darshan',
        type: 'paid',
        templeId: 'temple-sharada',
        price: 100,
        duration: 10,
        queueCapacity: 100,
        currentQueueLength: 25,
        isActive: true,
        availableTimeSlots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'darshan-003',
        name: 'VIP Darshan',
        type: 'vip',
        templeId: 'temple-sharada',
        price: 500,
        duration: 15,
        queueCapacity: 20,
        currentQueueLength: 3,
        isActive: true,
        availableTimeSlots: ['09:00 AM - 10:00 AM', '04:00 PM - 05:00 PM'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
];

export const mockDarshanEntries: DarshanEntry[] = [
    {
        id: 'entry-001',
        darshanId: 'darshan-001',
        templeId: 'temple-sharada',
        devoteeName: 'Suresh Iyer',
        entryTime: new Date().toISOString(),
        status: 'in-queue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'entry-002',
        darshanId: 'darshan-002',
        templeId: 'temple-sharada',
        devoteeName: 'Meera Joshi',
        entryTime: '2024-01-20T10:00:00Z',
        exitTime: '2024-01-20T10:10:00Z',
        tokenNumber: 'TKN-2024-001',
        amount: 100,
        status: 'completed',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:10:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
];

