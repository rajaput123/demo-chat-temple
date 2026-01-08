/**
 * Mock Data for Freelancer Management
 * 
 * Realistic freelancer data for Sringeri Sharada Peetham
 */

export interface Freelancer {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string[];
    expertise: string;
    hourlyRate?: number;
    projectRate?: number;
    availability: 'available' | 'busy' | 'unavailable';
    isActive: boolean;
    joinedDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface FreelancerContract {
    id: string;
    freelancerId: string;
    projectId?: string;
    title: string;
    description: string;
    contractType: 'hourly' | 'fixed' | 'retainer';
    rate: number;
    startDate: string;
    endDate?: string;
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    departmentId: string;
    createdAt: string;
    updatedAt: string;
}

export interface FreelancerProject {
    id: string;
    freelancerId: string;
    contractId: string;
    projectName: string;
    description: string;
    status: 'in-progress' | 'completed' | 'on-hold';
    deliverables: string[];
    deadline?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentRecord {
    id: string;
    freelancerId: string;
    contractId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'bank-transfer' | 'cheque' | 'cash';
    invoiceNumber?: string;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: string;
}

export const mockFreelancers: Freelancer[] = [
    {
        id: 'free-001',
        name: 'Rajesh Photography',
        email: 'rajesh.photo@example.com',
        phone: '+91 98765 45001',
        specialization: ['Event Photography', 'Temple Documentation', 'Video Production'],
        expertise: 'Professional temple event photography and videography',
        hourlyRate: 2000,
        availability: 'available',
        isActive: true,
        joinedDate: '2023-01-10',
        createdAt: '2023-01-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'free-002',
        name: 'Sanskrit Translation Services',
        email: 'sanskrit.trans@example.com',
        phone: '+91 98765 45002',
        specialization: ['Sanskrit Translation', 'Content Writing', 'Research'],
        expertise: 'Expert in Sanskrit texts, Vedic literature, and temple documentation',
        hourlyRate: 1500,
        availability: 'available',
        isActive: true,
        joinedDate: '2022-08-15',
        createdAt: '2022-08-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'free-003',
        name: 'Web Development Studio',
        email: 'webdev@example.com',
        phone: '+91 98765 45003',
        specialization: ['Web Development', 'Mobile Apps', 'Digital Solutions'],
        expertise: 'Temple website development and digital presence management',
        projectRate: 50000,
        availability: 'available',
        isActive: true,
        joinedDate: '2023-03-20',
        createdAt: '2023-03-20T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'free-004',
        name: 'Architectural Consultant',
        email: 'architect@example.com',
        phone: '+91 98765 45004',
        specialization: ['Temple Architecture', 'Renovation Planning', 'Heritage Conservation'],
        expertise: 'Traditional temple architecture and heritage conservation',
        hourlyRate: 3000,
        availability: 'busy',
        isActive: true,
        joinedDate: '2022-05-10',
        createdAt: '2022-05-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

export const mockFreelancerContracts: FreelancerContract[] = [
    {
        id: 'contract-001',
        freelancerId: 'free-001',
        projectId: 'proj-festival-001',
        title: 'Navaratri Festival Photography',
        description: 'Complete photography and videography coverage of Navaratri festival',
        contractType: 'fixed',
        rate: 50000,
        startDate: '2024-10-01',
        endDate: '2024-10-15',
        status: 'active',
        departmentId: 'dept-004',
        createdAt: '2024-09-15T10:00:00Z',
        updatedAt: '2024-09-15T10:00:00Z',
    },
    {
        id: 'contract-002',
        freelancerId: 'free-002',
        title: 'Sanskrit Content Translation',
        description: 'Translation of temple literature and documentation',
        contractType: 'retainer',
        rate: 20000,
        startDate: '2024-01-01',
        status: 'active',
        departmentId: 'dept-004',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
    },
    {
        id: 'contract-003',
        freelancerId: 'free-003',
        title: 'Temple Website Redesign',
        description: 'Complete redesign and development of temple website',
        contractType: 'fixed',
        rate: 150000,
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        status: 'active',
        departmentId: 'dept-004',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
];

export const mockFreelancerProjects: FreelancerProject[] = [
    {
        id: 'fproj-001',
        freelancerId: 'free-001',
        contractId: 'contract-001',
        projectName: 'Navaratri Festival Coverage',
        description: 'Photography and videography for Navaratri 2024',
        status: 'in-progress',
        deliverables: ['Event Photos', 'Video Documentation', 'Social Media Content'],
        deadline: '2024-10-20',
        createdAt: '2024-09-15T10:00:00Z',
        updatedAt: '2024-09-15T10:00:00Z',
    },
    {
        id: 'fproj-002',
        freelancerId: 'free-002',
        contractId: 'contract-002',
        projectName: 'Monthly Translation Work',
        description: 'Ongoing translation of temple documents',
        status: 'in-progress',
        deliverables: ['Translated Documents', 'Content Review'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

export const mockPaymentRecords: PaymentRecord[] = [
    {
        id: 'payment-001',
        freelancerId: 'free-001',
        contractId: 'contract-001',
        amount: 25000,
        paymentDate: '2024-09-20',
        paymentMethod: 'bank-transfer',
        invoiceNumber: 'INV-2024-001',
        status: 'paid',
        createdAt: '2024-09-20T10:00:00Z',
    },
    {
        id: 'payment-002',
        freelancerId: 'free-002',
        contractId: 'contract-002',
        amount: 20000,
        paymentDate: '2024-01-05',
        paymentMethod: 'bank-transfer',
        invoiceNumber: 'INV-2024-002',
        status: 'paid',
        createdAt: '2024-01-05T10:00:00Z',
    },
];

