/**
 * Mock Data for Asset Valuation & Finance
 * 
 * Realistic valuation data for Sringeri Sharada Peetham
 */

import { AssetValuation } from '@/types/asset';

export const mockAssetValuations: AssetValuation[] = [
    {
        id: 'val-001',
        assetId: 'asset-001',
        valuationDate: '2024-01-01',
        value: 5000000,
        valuationMethod: 'appraisal',
        valuatorId: 'emp-002',
        notes: 'Professional appraisal by certified valuator. Gold murti valued at current market rates.',
        financialRecordId: 'fin-001',
    },
    {
        id: 'val-002',
        assetId: 'asset-002',
        valuationDate: '2024-01-01',
        value: 50000,
        valuationMethod: 'market',
        valuatorId: 'emp-002',
        notes: 'Silver thali set valued at current silver market rates.',
        financialRecordId: 'fin-002',
    },
    {
        id: 'val-003',
        assetId: 'asset-003',
        valuationDate: '2024-01-01',
        value: 50000000,
        valuationMethod: 'historical',
        valuatorId: 'emp-002',
        notes: 'Temple building valued based on historical cost and appreciation.',
        financialRecordId: 'fin-003',
    },
    {
        id: 'val-004',
        assetId: 'asset-004',
        valuationDate: '2024-01-01',
        value: 150000,
        valuationMethod: 'depreciation',
        valuatorId: 'emp-002',
        notes: 'Sound system equipment valued with depreciation applied.',
        financialRecordId: 'fin-004',
    },
];

