/**
 * Mock Data for Content Management
 * 
 * Realistic content data for Sringeri Sharada Peetham
 */

export interface ContentItem {
    id: string;
    title: string;
    type: 'article' | 'video' | 'photo' | 'audio' | 'document';
    category: string;
    tags: string[];
    description?: string;
    content?: string; // For articles
    mediaUrl?: string; // For videos, photos, audio
    thumbnailUrl?: string;
    author?: string;
    publishDate?: string;
    status: 'draft' | 'published' | 'archived';
    views?: number;
    departmentId?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface ContentCategory {
    id: string;
    name: string;
    description?: string;
    parentCategoryId?: string;
    isActive: boolean;
    createdAt: string;
}

export interface MediaFile {
    id: string;
    contentId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    uploadedAt: string;
    uploadedBy: string;
}

export const mockContentItems: ContentItem[] = [
    {
        id: 'content-001',
        title: 'Navaratri Festival 2024 - Day 1 Highlights',
        type: 'video',
        category: 'Festivals',
        tags: ['Navaratri', 'Festival', 'Celebration', '2024'],
        description: 'Highlights from the first day of Navaratri festival celebrations',
        mediaUrl: '/media/videos/navaratri-day1.mp4',
        thumbnailUrl: '/media/thumbnails/navaratri-day1.jpg',
        author: 'Temple Media Team',
        publishDate: '2024-10-10',
        status: 'published',
        views: 12500,
        departmentId: 'dept-004',
        createdAt: '2024-10-10T10:00:00Z',
        updatedAt: '2024-10-10T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-006',
    },
    {
        id: 'content-002',
        title: 'Morning Aarti at Sharada Temple',
        type: 'photo',
        category: 'Daily Rituals',
        tags: ['Aarti', 'Morning', 'Ritual', 'Sharada Temple'],
        description: 'Beautiful morning aarti ceremony at the Sharada Temple',
        mediaUrl: '/media/photos/morning-aarti.jpg',
        thumbnailUrl: '/media/thumbnails/morning-aarti-thumb.jpg',
        author: 'Temple Media Team',
        publishDate: '2024-01-15',
        status: 'published',
        views: 8500,
        departmentId: 'dept-001',
        createdAt: '2024-01-15T06:00:00Z',
        updatedAt: '2024-01-15T06:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'content-003',
        title: 'History of Sringeri Sharada Peetham',
        type: 'article',
        category: 'History',
        tags: ['History', 'Peetham', 'Adi Shankaracharya', 'Heritage'],
        description: 'Comprehensive article on the history and significance of Sringeri Sharada Peetham',
        content: 'Sringeri Sharada Peetham is one of the four cardinal peethams established by Adi Shankaracharya...',
        thumbnailUrl: '/media/thumbnails/history-thumb.jpg',
        author: 'Dr. Krishnamurthy Shastri',
        publishDate: '2024-01-01',
        status: 'published',
        views: 15200,
        departmentId: 'dept-001',
        createdAt: '2023-12-20T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'content-004',
        title: 'Vedic Chanting - Rig Veda Recitation',
        type: 'audio',
        category: 'Vedic Studies',
        tags: ['Vedic', 'Chanting', 'Rig Veda', 'Audio'],
        description: 'Traditional Rig Veda recitation by Veda Pathashala students',
        mediaUrl: '/media/audio/rig-veda-recitation.mp3',
        thumbnailUrl: '/media/thumbnails/vedic-audio-thumb.jpg',
        author: 'Veda Pathashala',
        publishDate: '2024-01-10',
        status: 'published',
        views: 3200,
        departmentId: 'dept-001',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'content-005',
        title: 'Annual Report 2023',
        type: 'document',
        category: 'Reports',
        tags: ['Annual Report', '2023', 'Financial', 'Activities'],
        description: 'Comprehensive annual report covering all temple activities and financials',
        mediaUrl: '/media/documents/annual-report-2023.pdf',
        thumbnailUrl: '/media/thumbnails/report-thumb.jpg',
        author: 'Temple Administration',
        publishDate: '2024-01-05',
        status: 'published',
        views: 2100,
        departmentId: 'dept-002',
        createdAt: '2024-01-05T10:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
];

export const mockContentCategories: ContentCategory[] = [
    {
        id: 'cat-001',
        name: 'Festivals',
        description: 'Festival celebrations and events',
        isActive: true,
        createdAt: '2023-01-01T10:00:00Z',
    },
    {
        id: 'cat-002',
        name: 'Daily Rituals',
        description: 'Daily temple rituals and ceremonies',
        isActive: true,
        createdAt: '2023-01-01T10:00:00Z',
    },
    {
        id: 'cat-003',
        name: 'History',
        description: 'Historical content and heritage',
        isActive: true,
        createdAt: '2023-01-01T10:00:00Z',
    },
    {
        id: 'cat-004',
        name: 'Vedic Studies',
        description: 'Vedic education and learning',
        isActive: true,
        createdAt: '2023-01-01T10:00:00Z',
    },
    {
        id: 'cat-005',
        name: 'Reports',
        description: 'Official reports and documents',
        isActive: true,
        createdAt: '2023-01-01T10:00:00Z',
    },
];

export const mockMediaFiles: MediaFile[] = [
    {
        id: 'media-001',
        contentId: 'content-001',
        fileName: 'navaratri-day1.mp4',
        fileType: 'video/mp4',
        fileSize: 52428800, // 50 MB
        fileUrl: '/media/videos/navaratri-day1.mp4',
        uploadedAt: '2024-10-10T10:00:00Z',
        uploadedBy: 'emp-006',
    },
    {
        id: 'media-002',
        contentId: 'content-002',
        fileName: 'morning-aarti.jpg',
        fileType: 'image/jpeg',
        fileSize: 3145728, // 3 MB
        fileUrl: '/media/photos/morning-aarti.jpg',
        uploadedAt: '2024-01-15T06:00:00Z',
        uploadedBy: 'emp-001',
    },
];

