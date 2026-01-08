/**
 * Mock Data for Volunteer Management
 * 
 * Realistic volunteer data for Sringeri Sharada Peetham
 */

export interface Volunteer {
    id: string;
    name: string;
    email?: string;
    phone: string;
    address?: string;
    departmentId?: string;
    skills: string[];
    availability: 'full-time' | 'part-time' | 'occasional';
    serviceHours: number; // Total hours served
    isActive: boolean;
    joinedDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface VolunteerSchedule {
    id: string;
    volunteerId: string;
    date: string;
    startTime: string;
    endTime: string;
    assignment: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    createdAt: string;
}

export interface ServiceHoursRecord {
    id: string;
    volunteerId: string;
    date: string;
    hours: number;
    activity: string;
    departmentId: string;
    verifiedBy?: string;
    createdAt: string;
}

export const mockVolunteers: Volunteer[] = [
    {
        id: 'vol-001',
        name: 'Lakshmi Devi',
        email: 'lakshmi.devi@example.com',
        phone: '+91 98765 44001',
        address: 'Sringeri, Karnataka',
        departmentId: 'dept-004',
        skills: ['Kitchen Assistance', 'Prasad Distribution', 'Cleaning'],
        availability: 'part-time',
        serviceHours: 120,
        isActive: true,
        joinedDate: '2023-01-15',
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vol-002',
        name: 'Ramesh Kumar',
        email: 'ramesh.kumar@example.com',
        phone: '+91 98765 44002',
        address: 'Sringeri, Karnataka',
        departmentId: 'dept-004',
        skills: ['Crowd Management', 'Queue Management', 'Security Assistance'],
        availability: 'full-time',
        serviceHours: 350,
        isActive: true,
        joinedDate: '2022-06-10',
        createdAt: '2022-06-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vol-003',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98765 44003',
        address: 'Sringeri, Karnataka',
        departmentId: 'dept-001',
        skills: ['Ritual Assistance', 'Flower Arrangement', 'Decoration'],
        availability: 'part-time',
        serviceHours: 95,
        isActive: true,
        joinedDate: '2023-03-20',
        createdAt: '2023-03-20T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vol-004',
        name: 'Suresh Iyer',
        email: 'suresh.iyer@example.com',
        phone: '+91 98765 44004',
        address: 'Sringeri, Karnataka',
        departmentId: 'dept-002',
        skills: ['Data Entry', 'Record Keeping', 'Administrative Support'],
        availability: 'part-time',
        serviceHours: 180,
        isActive: true,
        joinedDate: '2022-09-05',
        createdAt: '2022-09-05T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'vol-005',
        name: 'Meera Joshi',
        email: 'meera.joshi@example.com',
        phone: '+91 98765 44005',
        address: 'Sringeri, Karnataka',
        departmentId: 'dept-004',
        skills: ['Translation', 'Content Writing', 'Social Media'],
        availability: 'occasional',
        serviceHours: 45,
        isActive: true,
        joinedDate: '2023-08-12',
        createdAt: '2023-08-12T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

export const mockVolunteerSchedules: VolunteerSchedule[] = [
    {
        id: 'schedule-001',
        volunteerId: 'vol-001',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00 AM',
        endTime: '12:00 PM',
        assignment: 'Kitchen Assistance - Prasad Preparation',
        status: 'scheduled',
        createdAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'schedule-002',
        volunteerId: 'vol-002',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        assignment: 'Crowd Management - Main Temple Area',
        status: 'scheduled',
        createdAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'schedule-003',
        volunteerId: 'vol-003',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        startTime: '06:00 AM',
        endTime: '10:00 AM',
        assignment: 'Ritual Assistance - Morning Aarti',
        status: 'scheduled',
        createdAt: '2024-01-21T10:00:00Z',
    },
];

export const mockServiceHoursRecords: ServiceHoursRecord[] = [
    {
        id: 'hours-001',
        volunteerId: 'vol-001',
        date: '2024-01-15',
        hours: 4,
        activity: 'Kitchen Assistance',
        departmentId: 'dept-004',
        verifiedBy: 'emp-006',
        createdAt: '2024-01-15T18:00:00Z',
    },
    {
        id: 'hours-002',
        volunteerId: 'vol-002',
        date: '2024-01-15',
        hours: 8,
        activity: 'Crowd Management',
        departmentId: 'dept-004',
        verifiedBy: 'emp-006',
        createdAt: '2024-01-15T18:00:00Z',
    },
    {
        id: 'hours-003',
        volunteerId: 'vol-003',
        date: '2024-01-16',
        hours: 4,
        activity: 'Ritual Assistance',
        departmentId: 'dept-001',
        verifiedBy: 'emp-001',
        createdAt: '2024-01-16T18:00:00Z',
    },
];

