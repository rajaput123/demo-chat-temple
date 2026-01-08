/**
 * Mock Data for Temple Management
 * 
 * Realistic temple management data for Sringeri Sharada Peetham
 */

export interface TempleSchedule {
    id: string;
    templeId: string;
    date: string;
    activities: TempleActivity[];
    createdAt: string;
    updatedAt: string;
}

export interface TempleActivity {
    id: string;
    name: string;
    type: 'ritual' | 'darshan' | 'seva' | 'special-event';
    startTime: string;
    endTime: string;
    location: string;
    priestId?: string;
    description?: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface RitualTiming {
    id: string;
    ritualName: string;
    templeId: string;
    dailyTimings: {
        morning?: string;
        afternoon?: string;
        evening?: string;
    };
    specialDays?: {
        date: string;
        timings: string[];
    }[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const mockTempleSchedules: TempleSchedule[] = [
    {
        id: 'schedule-001',
        templeId: 'temple-sharada',
        date: new Date().toISOString().split('T')[0],
        activities: [
            {
                id: 'act-001',
                name: 'Morning Aarti',
                type: 'ritual',
                startTime: '06:00 AM',
                endTime: '07:00 AM',
                location: 'Sharada Temple - Main Sanctum',
                priestId: 'priest-001',
                description: 'Daily morning aarti ceremony',
                status: 'scheduled',
            },
            {
                id: 'act-002',
                name: 'VIP Darshan',
                type: 'darshan',
                startTime: '09:00 AM',
                endTime: '10:00 AM',
                location: 'Sharada Temple',
                description: 'VIP darshan time slot',
                status: 'scheduled',
            },
            {
                id: 'act-003',
                name: 'Evening Aarti',
                type: 'ritual',
                startTime: '07:00 PM',
                endTime: '08:00 PM',
                location: 'Sharada Temple - Main Sanctum',
                priestId: 'priest-002',
                description: 'Daily evening aarti ceremony',
                status: 'scheduled',
            },
        ],
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
];

export const mockRitualTimings: RitualTiming[] = [
    {
        id: 'ritual-001',
        ritualName: 'Morning Aarti',
        templeId: 'temple-sharada',
        dailyTimings: {
            morning: '06:00 AM',
        },
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
    },
    {
        id: 'ritual-002',
        ritualName: 'Evening Aarti',
        templeId: 'temple-sharada',
        dailyTimings: {
            evening: '07:00 PM',
        },
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
    },
    {
        id: 'ritual-003',
        ritualName: 'Abhishekam',
        templeId: 'temple-sharada',
        dailyTimings: {
            morning: '09:00 AM',
        },
        specialDays: [
            {
                date: '2024-10-10',
                timings: ['09:00 AM', '11:00 AM', '02:00 PM'],
            },
        ],
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
    },
];

