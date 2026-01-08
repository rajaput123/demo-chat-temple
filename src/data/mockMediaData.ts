/**
 * Mock Data for PR & Communication Management
 * 
 * Realistic PR and media communication data for Sringeri Sharada Peetham
 */

export interface PressRelease {
    id: string;
    title: string;
    content: string;
    category: 'announcement' | 'event' | 'festival' | 'general';
    publishDate?: string;
    expiryDate?: string;
    status: 'draft' | 'scheduled' | 'published' | 'archived';
    mediaContacts: string[];
    attachments?: string[];
    departmentId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface SocialMediaPost {
    id: string;
    platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'linkedin';
    content: string;
    mediaUrl?: string;
    scheduledDate?: string;
    publishedDate?: string;
    status: 'draft' | 'scheduled' | 'published';
    engagement?: {
        likes?: number;
        shares?: number;
        comments?: number;
        views?: number;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CommunicationLog {
    id: string;
    type: 'email' | 'phone' | 'meeting' | 'press-release' | 'social-media';
    subject: string;
    recipient?: string;
    content: string;
    date: string;
    status: 'sent' | 'received' | 'scheduled';
    departmentId?: string;
    createdAt: string;
    createdBy: string;
}

export interface PRCampaign {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    channels: string[];
    budget?: number;
    deliverables: string[];
    departmentId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export const mockPressReleases: PressRelease[] = [
    {
        id: 'pr-001',
        title: 'Navaratri Festival 2024 - Grand Celebrations Begin',
        content: 'Sringeri Sharada Peetham announces the commencement of Navaratri festival celebrations...',
        category: 'festival',
        publishDate: '2024-10-01',
        status: 'published',
        mediaContacts: ['media@example.com', 'press@example.com'],
        attachments: ['/media/documents/navaratri-2024-press-release.pdf'],
        departmentId: 'dept-004',
        createdAt: '2024-09-25T10:00:00Z',
        updatedAt: '2024-10-01T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-006',
    },
    {
        id: 'pr-002',
        title: 'Prime Minister Visit - Special Protocol Arrangements',
        content: 'Sringeri Sharada Peetham prepares for the visit of Honorable Prime Minister...',
        category: 'announcement',
        publishDate: '2024-01-20',
        status: 'published',
        mediaContacts: ['media@example.com'],
        departmentId: 'dept-004',
        createdAt: '2024-01-18T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-006',
    },
    {
        id: 'pr-003',
        title: 'Annual Veda Pathashala Graduation Ceremony',
        content: 'Celebrating the graduation of Veda Pathashala students...',
        category: 'event',
        publishDate: '2024-03-15',
        status: 'scheduled',
        mediaContacts: ['education@example.com'],
        departmentId: 'dept-001',
        createdAt: '2024-03-10T10:00:00Z',
        updatedAt: '2024-03-10T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
];

export const mockSocialMediaPosts: SocialMediaPost[] = [
    {
        id: 'soc-001',
        platform: 'facebook',
        content: 'Join us for the grand Navaratri celebrations at Sringeri Sharada Peetham. Daily rituals, special pujas, and cultural programs await you. #Navaratri2024 #Sringeri',
        mediaUrl: '/media/photos/navaratri-fb.jpg',
        publishedDate: '2024-10-01T08:00:00Z',
        status: 'published',
        engagement: {
            likes: 1250,
            shares: 180,
            comments: 95,
            views: 8500,
        },
        createdAt: '2024-09-30T10:00:00Z',
        updatedAt: '2024-10-01T08:00:00Z',
        createdBy: 'emp-006',
    },
    {
        id: 'soc-002',
        platform: 'instagram',
        content: 'Morning aarti at Sharada Temple - A divine start to the day 🙏✨ #Sringeri #SharadaTemple #MorningAarti',
        mediaUrl: '/media/photos/morning-aarti-instagram.jpg',
        publishedDate: '2024-01-15T06:30:00Z',
        status: 'published',
        engagement: {
            likes: 3200,
            shares: 450,
            comments: 120,
            views: 15200,
        },
        createdAt: '2024-01-15T06:00:00Z',
        updatedAt: '2024-01-15T06:30:00Z',
        createdBy: 'emp-001',
    },
    {
        id: 'soc-003',
        platform: 'youtube',
        content: 'Watch: Complete Navaratri Day 1 Highlights - Rituals, Celebrations, and Devotional Music',
        mediaUrl: '/media/videos/navaratri-day1.mp4',
        scheduledDate: '2024-10-10T18:00:00Z',
        status: 'scheduled',
        createdAt: '2024-10-10T10:00:00Z',
        updatedAt: '2024-10-10T10:00:00Z',
        createdBy: 'emp-006',
    },
];

export const mockCommunicationLogs: CommunicationLog[] = [
    {
        id: 'comm-001',
        type: 'email',
        subject: 'Navaratri Festival Media Coverage Request',
        recipient: 'media@example.com',
        content: 'Requesting media coverage for Navaratri festival celebrations...',
        date: '2024-09-25T10:00:00Z',
        status: 'sent',
        departmentId: 'dept-004',
        createdAt: '2024-09-25T10:00:00Z',
        createdBy: 'emp-006',
    },
    {
        id: 'comm-002',
        type: 'phone',
        subject: 'Follow-up call with Press Representative',
        recipient: '+91 98765 12345',
        content: 'Discussed upcoming festival coverage and media arrangements',
        date: '2024-09-26T14:00:00Z',
        status: 'sent',
        departmentId: 'dept-004',
        createdAt: '2024-09-26T14:00:00Z',
        createdBy: 'emp-006',
    },
    {
        id: 'comm-003',
        type: 'press-release',
        subject: 'Prime Minister Visit Announcement',
        content: 'Published press release regarding Prime Minister visit arrangements',
        date: '2024-01-20T10:00:00Z',
        status: 'sent',
        departmentId: 'dept-004',
        createdAt: '2024-01-20T10:00:00Z',
        createdBy: 'emp-006',
    },
];

export const mockPRCampaigns: PRCampaign[] = [
    {
        id: 'campaign-001',
        name: 'Navaratri 2024 Digital Campaign',
        description: 'Comprehensive digital media campaign for Navaratri festival',
        startDate: '2024-10-01',
        endDate: '2024-10-15',
        status: 'active',
        channels: ['Facebook', 'Instagram', 'YouTube', 'Twitter'],
        budget: 50000,
        deliverables: ['Daily posts', 'Video content', 'Live streaming', 'Press releases'],
        departmentId: 'dept-004',
        createdAt: '2024-09-20T10:00:00Z',
        updatedAt: '2024-10-01T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-006',
    },
    {
        id: 'campaign-002',
        name: 'Temple Heritage Awareness',
        description: 'Campaign to raise awareness about temple heritage and history',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        channels: ['Facebook', 'Instagram', 'Website'],
        budget: 100000,
        deliverables: ['Monthly articles', 'Heritage videos', 'Educational content'],
        departmentId: 'dept-004',
        createdAt: '2023-12-15T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-006',
    },
];

