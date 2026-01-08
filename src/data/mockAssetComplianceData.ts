/**
 * Mock Data for Asset Compliance & Legal
 * 
 * Realistic compliance data for Sringeri Sharada Peetham
 */

export interface AssetComplianceRecord {
    id: string;
    assetId: string;
    documentType: 'deed' | 'title' | 'insurance' | 'legal' | 'tax';
    documentTitle: string;
    documentUrl: string;
    issueDate: string;
    expiryDate?: string;
    status: 'active' | 'expired' | 'pending-renewal';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export const mockAssetComplianceRecords: AssetComplianceRecord[] = [
    {
        id: 'comp-asset-001',
        assetId: 'asset-001',
        documentType: 'insurance',
        documentTitle: 'Gold Murti Insurance Policy',
        documentUrl: '/documents/assets/insurance-gold-murti.pdf',
        issueDate: '2024-01-01',
        expiryDate: '2025-01-01',
        status: 'active',
        notes: 'Comprehensive insurance coverage for gold murti',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
    {
        id: 'comp-asset-002',
        assetId: 'asset-003',
        documentType: 'deed',
        documentTitle: 'Temple Building Property Deed',
        documentUrl: '/documents/assets/temple-deed.pdf',
        issueDate: '1950-01-01',
        status: 'active',
        notes: 'Original property deed for temple building',
        createdAt: '1950-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'emp-002',
    },
    {
        id: 'comp-asset-003',
        assetId: 'asset-005',
        documentType: 'title',
        documentTitle: 'Land Ownership Title',
        documentUrl: '/documents/assets/land-title.pdf',
        issueDate: '1950-01-01',
        status: 'active',
        notes: 'Land ownership title for main temple premises',
        createdAt: '1950-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'emp-002',
    },
    {
        id: 'comp-asset-004',
        assetId: 'asset-003',
        documentType: 'insurance',
        documentTitle: 'Temple Building Insurance Policy',
        documentUrl: '/documents/assets/insurance-building.pdf',
        issueDate: '2024-01-01',
        expiryDate: '2025-01-01',
        status: 'active',
        notes: 'Property insurance for temple building',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
];

