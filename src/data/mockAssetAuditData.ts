/**
 * Mock Data for Asset Audit & Verification
 * 
 * Realistic audit data for Sringeri Sharada Peetham
 */

import { AssetAudit } from '@/types/asset';

export const mockAssetAudits: AssetAudit[] = [
    {
        id: 'audit-001',
        assetId: 'asset-001',
        auditDate: '2024-01-10',
        auditorId: 'emp-004',
        condition: 'excellent',
        wearLevel: 5,
        verificationStatus: 'verified',
        notes: 'Gold murti verified. All components present and in excellent condition.',
    },
    {
        id: 'audit-002',
        assetId: 'asset-002',
        auditDate: '2024-01-10',
        auditorId: 'emp-004',
        condition: 'good',
        wearLevel: 15,
        verificationStatus: 'verified',
        notes: 'Silver thali set verified. All 5 thalis present. Minor wear from regular use.',
    },
    {
        id: 'audit-003',
        assetId: 'asset-003',
        auditDate: '2024-01-05',
        auditorId: 'emp-004',
        condition: 'good',
        wearLevel: 20,
        verificationStatus: 'verified',
        notes: 'Temple building structural audit completed. Building in good condition.',
    },
    {
        id: 'audit-004',
        assetId: 'asset-004',
        auditDate: '2023-12-20',
        auditorId: 'emp-006',
        condition: 'good',
        wearLevel: 25,
        verificationStatus: 'verified',
        notes: 'Sound system equipment verified. All components functional after recent maintenance.',
    },
];

