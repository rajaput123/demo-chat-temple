/**
 * Mock Data for Asset Disposal & Retirement
 * 
 * Realistic disposal data for Sringeri Sharada Peetham
 */

export interface AssetDisposal {
    id: string;
    assetId: string;
    disposalType: 'decommission' | 'sell' | 'donate' | 'recycle' | 'destroy';
    reason: string;
    requestedBy: string;
    requestedDate: string;
    approvedBy?: string;
    approvedDate?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    disposalDate?: string;
    disposalValue?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export const mockAssetDisposals: AssetDisposal[] = [
    {
        id: 'disposal-001',
        assetId: 'asset-old-001',
        disposalType: 'recycle',
        reason: 'Obsolete equipment - replaced with new system',
        requestedBy: 'emp-006',
        requestedDate: '2024-01-10',
        approvedBy: 'emp-004',
        approvedDate: '2024-01-12',
        status: 'approved',
        disposalValue: 5000,
        notes: 'Old sound system to be recycled. Components to be salvaged where possible.',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-12T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-004',
    },
    {
        id: 'disposal-002',
        assetId: 'asset-old-002',
        disposalType: 'decommission',
        reason: 'End of useful life - no longer functional',
        requestedBy: 'emp-004',
        requestedDate: '2024-01-15',
        status: 'pending',
        notes: 'Old furniture items to be decommissioned and replaced',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-004',
        updatedBy: 'emp-004',
    },
];

