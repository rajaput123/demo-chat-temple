/**
 * Mock Data for Asset Movement Tracking
 * 
 * Realistic asset movement data for Sringeri Sharada Peetham
 */

import { AssetMovement } from '@/types/asset';

export const mockAssetMovements: AssetMovement[] = [
    {
        id: 'move-001',
        assetId: 'asset-002',
        fromLocation: 'Main Vault - Section B',
        toLocation: 'Main Temple - Ritual Area',
        fromCustodianId: 'emp-004',
        toCustodianId: 'emp-001',
        movedBy: 'emp-001',
        movedAt: new Date().toISOString(),
        reason: 'Daily morning aarti ritual',
        approvedBy: 'emp-004',
    },
    {
        id: 'move-002',
        assetId: 'asset-004',
        fromLocation: 'Storage Room - Equipment',
        toLocation: 'Main Hall',
        fromCustodianId: 'emp-006',
        toCustodianId: 'emp-006',
        movedBy: 'emp-006',
        movedAt: '2024-01-15T18:00:00Z',
        reason: 'Evening discourse sound system setup',
        approvedBy: 'emp-006',
    },
    {
        id: 'move-003',
        assetId: 'asset-002',
        fromLocation: 'Main Temple - Ritual Area',
        toLocation: 'Main Vault - Section B',
        fromCustodianId: 'emp-001',
        toCustodianId: 'emp-004',
        movedBy: 'emp-001',
        movedAt: '2024-01-15T10:00:00Z',
        reason: 'Return after morning aarti completion',
        approvedBy: 'emp-004',
    },
];

