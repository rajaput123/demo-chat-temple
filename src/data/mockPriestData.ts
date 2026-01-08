/**
 * Mock Data for Priest Management
 * 
 * Realistic priest data for Sringeri Sharada Peetham
 */

export interface Priest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    qualifications: string[];
    certifications: string[];
    specialization: string[]; // e.g., 'Vedic Rituals', 'Homam', 'Abhishekam'
    experienceYears: number;
    departmentId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RitualAssignment {
    id: string;
    priestId: string;
    ritualType: string;
    templeId: string;
    scheduledDate: string;
    scheduledTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface TrainingRecord {
    id: string;
    priestId: string;
    trainingType: string;
    trainingDate: string;
    completed: boolean;
    certificateIssued: boolean;
    notes?: string;
    createdAt: string;
}

export const mockPriests: Priest[] = [
    {
        id: 'priest-001',
        name: 'Venkatesh Purohit',
        email: 'venkatesh.purohit@sringeri.org',
        phone: '+91 98765 43001',
        qualifications: ['Veda Pathashala Graduate', 'Sanskrit Scholar'],
        certifications: ['Ritual Certification - Advanced', 'Homam Specialist'],
        specialization: ['Morning Aarti', 'Abhishekam', 'Homam'],
        experienceYears: 15,
        departmentId: 'dept-001',
        isActive: true,
        createdAt: '2020-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'priest-002',
        name: 'Ramesh Archaka',
        email: 'ramesh.archaka@sringeri.org',
        phone: '+91 98765 43002',
        qualifications: ['Veda Pathashala Graduate', 'Agama Shastra'],
        certifications: ['Temple Ritual Certification', 'Archaka Certification'],
        specialization: ['Evening Aarti', 'Puja', 'Special Rituals'],
        experienceYears: 12,
        departmentId: 'dept-001',
        isActive: true,
        createdAt: '2020-03-20T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'priest-003',
        name: 'Srinivasa Purohit',
        email: 'srinivasa.purohit@sringeri.org',
        phone: '+91 98765 43003',
        qualifications: ['Veda Pathashala Graduate', 'Sanskrit Master'],
        certifications: ['Ritual Certification', 'Vedic Chanting Expert'],
        specialization: ['Vedic Chanting', 'Homa', 'Festival Rituals'],
        experienceYears: 10,
        departmentId: 'dept-001',
        isActive: true,
        createdAt: '2021-05-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'priest-004',
        name: 'Krishnamurthy Shastri',
        email: 'krishnamurthy.shastri@sringeri.org',
        phone: '+91 98765 43011',
        qualifications: ['Veda Pathashala Teacher', 'Sanskrit Professor'],
        certifications: ['Teaching Certification', 'Vedic Studies Expert'],
        specialization: ['Teaching', 'Vedic Studies', 'Research'],
        experienceYears: 20,
        departmentId: 'dept-001',
        isActive: true,
        createdAt: '2019-08-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'priest-005',
        name: 'Narayana Shastri',
        email: 'narayana.shastri@sringeri.org',
        phone: '+91 98765 43012',
        qualifications: ['Veda Pathashala Graduate', 'Agama Specialist'],
        certifications: ['Ritual Certification', 'Festival Coordinator'],
        specialization: ['Festival Rituals', 'Special Events', 'VIP Services'],
        experienceYears: 14,
        departmentId: 'dept-001',
        isActive: true,
        createdAt: '2020-02-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

export const mockRitualAssignments: RitualAssignment[] = [
    {
        id: 'ritual-001',
        priestId: 'priest-001',
        ritualType: 'Morning Aarti',
        templeId: 'temple-sharada',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '06:00 AM',
        status: 'scheduled',
        createdAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ritual-002',
        priestId: 'priest-002',
        ritualType: 'Evening Aarti',
        templeId: 'temple-sharada',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '07:00 PM',
        status: 'scheduled',
        createdAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'ritual-003',
        priestId: 'priest-003',
        ritualType: 'Abhishekam',
        templeId: 'temple-sharada',
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        scheduledTime: '09:00 AM',
        status: 'scheduled',
        createdAt: '2024-01-21T10:00:00Z',
    },
];

export const mockTrainingRecords: TrainingRecord[] = [
    {
        id: 'training-001',
        priestId: 'priest-001',
        trainingType: 'Advanced Ritual Techniques',
        trainingDate: '2023-06-15',
        completed: true,
        certificateIssued: true,
        notes: 'Completed advanced training in complex rituals',
        createdAt: '2023-06-15T10:00:00Z',
    },
    {
        id: 'training-002',
        priestId: 'priest-002',
        trainingType: 'Agama Shastra Workshop',
        trainingDate: '2023-08-20',
        completed: true,
        certificateIssued: true,
        notes: 'Completed Agama Shastra certification',
        createdAt: '2023-08-20T10:00:00Z',
    },
    {
        id: 'training-003',
        priestId: 'priest-003',
        trainingType: 'Vedic Chanting Masterclass',
        trainingDate: '2024-01-10',
        completed: true,
        certificateIssued: true,
        notes: 'Masterclass in advanced Vedic chanting techniques',
        createdAt: '2024-01-10T10:00:00Z',
    },
];

