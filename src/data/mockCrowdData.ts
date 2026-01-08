/**
 * Mock Data for Crowd & Capacity Management
 * 
 * Realistic crowd management data for Sringeri Sharada Peetham
 */

export interface CrowdSnapshot {
    id: string;
    location: string;
    timestamp: string;
    currentCount: number;
    capacity: number;
    utilization: number; // percentage
    status: 'normal' | 'moderate' | 'high' | 'critical';
    zoneId?: string;
}

export interface Zone {
    id: string;
    name: string;
    location: string;
    capacity: number;
    currentCount: number;
    status: 'available' | 'near-capacity' | 'full';
    createdAt: string;
    updatedAt: string;
}

export interface CapacityAnalytics {
    id: string;
    date: string;
    location: string;
    peakTime: string;
    peakCount: number;
    averageCount: number;
    totalVisitors: number;
    createdAt: string;
}

export const mockCrowdSnapshots: CrowdSnapshot[] = [
    {
        id: 'snapshot-001',
        location: 'Main Temple Area',
        timestamp: new Date().toISOString(),
        currentCount: 350,
        capacity: 500,
        utilization: 70,
        status: 'moderate',
        zoneId: 'zone-001',
    },
    {
        id: 'snapshot-002',
        location: 'Darshan Queue Area',
        timestamp: new Date().toISOString(),
        currentCount: 150,
        capacity: 200,
        utilization: 75,
        status: 'moderate',
        zoneId: 'zone-002',
    },
    {
        id: 'snapshot-003',
        location: 'Annadanam Hall',
        timestamp: new Date().toISOString(),
        currentCount: 800,
        capacity: 1000,
        utilization: 80,
        status: 'high',
        zoneId: 'zone-003',
    },
];

export const mockZones: Zone[] = [
    {
        id: 'zone-001',
        name: 'Main Temple Area',
        location: 'Sharada Temple - Main Hall',
        capacity: 500,
        currentCount: 350,
        status: 'available',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'zone-002',
        name: 'Darshan Queue Area',
        location: 'Temple Entrance - Queue Zone',
        capacity: 200,
        currentCount: 150,
        status: 'available',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'zone-003',
        name: 'Annadanam Hall',
        location: 'Annadanam Facility - Dining Hall',
        capacity: 1000,
        currentCount: 800,
        status: 'near-capacity',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
    },
];

export const mockCapacityAnalytics: CapacityAnalytics[] = [
    {
        id: 'analytics-001',
        date: new Date().toISOString().split('T')[0],
        location: 'Main Temple Area',
        peakTime: '11:00 AM',
        peakCount: 450,
        averageCount: 320,
        totalVisitors: 2500,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'analytics-002',
        date: new Date().toISOString().split('T')[0],
        location: 'Annadanam Hall',
        peakTime: '12:30 PM',
        peakCount: 950,
        averageCount: 750,
        totalVisitors: 3500,
        createdAt: new Date().toISOString(),
    },
];

