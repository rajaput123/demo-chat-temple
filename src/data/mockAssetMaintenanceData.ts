/**
 * Mock Data for Asset Maintenance & Preservation
 * 
 * Realistic maintenance data for Sringeri Sharada Peetham
 */

import { AssetMaintenance } from '@/types/asset';

export const mockAssetMaintenance: AssetMaintenance[] = [
    {
        id: 'maint-001',
        assetId: 'asset-001',
        maintenanceDate: '2024-01-10',
        maintenanceType: 'preventive',
        performedBy: 'emp-004',
        cost: 5000,
        nextMaintenanceDate: '2024-07-10',
        notes: 'Regular cleaning and inspection of gold murti. All components in excellent condition.',
        expenseTransactionId: 'exp-001',
    },
    {
        id: 'maint-002',
        assetId: 'asset-003',
        maintenanceDate: '2024-01-05',
        maintenanceType: 'preventive',
        performedBy: 'emp-004',
        cost: 50000,
        nextMaintenanceDate: '2024-07-05',
        notes: 'Temple building structural inspection and minor repairs. Building in good condition.',
        expenseTransactionId: 'exp-002',
    },
    {
        id: 'maint-003',
        assetId: 'asset-004',
        maintenanceDate: '2023-12-20',
        maintenanceType: 'corrective',
        performedBy: 'emp-006',
        cost: 15000,
        nextMaintenanceDate: '2024-06-20',
        notes: 'Sound system amplifier repair and speaker maintenance.',
        expenseTransactionId: 'exp-003',
    },
    {
        id: 'maint-004',
        assetId: 'asset-002',
        maintenanceDate: '2024-01-01',
        maintenanceType: 'preventive',
        performedBy: 'emp-001',
        cost: 2000,
        nextMaintenanceDate: '2024-04-01',
        notes: 'Silver thali set polishing and cleaning.',
    },
];

