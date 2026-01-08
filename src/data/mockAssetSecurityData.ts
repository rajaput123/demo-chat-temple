/**
 * Mock Data for Asset Security & Custody
 * 
 * Realistic security and custody data for Sringeri Sharada Peetham
 */

export interface CustodyRecord {
    id: string;
    assetId: string;
    custodianId: string;
    assignedDate: string;
    releaseDate?: string;
    status: 'active' | 'released' | 'transferred';
    accessLevel: 'full' | 'supervised' | 'restricted';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface AccessLog {
    id: string;
    assetId: string;
    accessedBy: string;
    accessType: 'view' | 'move' | 'use' | 'maintenance' | 'audit';
    accessDate: string;
    location?: string;
    reason: string;
    approvedBy?: string;
    duration?: number; // in minutes
    createdAt: string;
}

export interface SecurityProtocol {
    id: string;
    assetId: string;
    protocolLevel: 'maximum' | 'high' | 'standard';
    requirements: string[];
    restrictions: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export const mockCustodyRecords: CustodyRecord[] = [
    {
        id: 'custody-001',
        assetId: 'asset-001',
        custodianId: 'emp-004',
        assignedDate: '2020-01-01',
        status: 'active',
        accessLevel: 'restricted',
        notes: 'Sacred murti - maximum security required',
        createdAt: '2020-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'emp-004',
    },
    {
        id: 'custody-002',
        assetId: 'asset-002',
        custodianId: 'emp-001',
        assignedDate: '2020-05-15',
        status: 'active',
        accessLevel: 'supervised',
        notes: 'Ritual items - supervised access during rituals only',
        createdAt: '2020-05-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-004',
        updatedBy: 'emp-004',
    },
    {
        id: 'custody-003',
        assetId: 'asset-004',
        custodianId: 'emp-006',
        assignedDate: '2022-03-10',
        status: 'active',
        accessLevel: 'full',
        notes: 'Operational equipment - full access for events',
        createdAt: '2022-03-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-004',
        updatedBy: 'emp-004',
    },
];

export const mockAccessLogs: AccessLog[] = [
    {
        id: 'access-001',
        assetId: 'asset-001',
        accessedBy: 'emp-004',
        accessType: 'audit',
        accessDate: '2024-01-10T10:00:00Z',
        location: 'Main Vault - Section A',
        reason: 'Monthly security audit',
        approvedBy: 'emp-004',
        duration: 30,
        createdAt: '2024-01-10T10:00:00Z',
    },
    {
        id: 'access-002',
        assetId: 'asset-002',
        accessedBy: 'emp-001',
        accessType: 'use',
        accessDate: new Date().toISOString(),
        location: 'Main Temple - Ritual Area',
        reason: 'Daily morning aarti',
        approvedBy: 'emp-001',
        duration: 60,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'access-003',
        assetId: 'asset-004',
        accessedBy: 'emp-006',
        accessType: 'use',
        accessDate: '2024-01-15T18:00:00Z',
        location: 'Main Hall',
        reason: 'Evening discourse sound system setup',
        approvedBy: 'emp-006',
        duration: 120,
        createdAt: '2024-01-15T18:00:00Z',
    },
];

export const mockSecurityProtocols: SecurityProtocol[] = [
    {
        id: 'protocol-001',
        assetId: 'asset-001',
        protocolLevel: 'maximum',
        requirements: [
            'Dual custodian approval required',
            'Security escort mandatory',
            'Video surveillance during access',
            'Access log mandatory',
        ],
        restrictions: [
            'No photography allowed',
            'Maximum 2 people at a time',
            'Access only during business hours',
        ],
        isActive: true,
        createdAt: '2020-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'emp-004',
    },
    {
        id: 'protocol-002',
        assetId: 'asset-002',
        protocolLevel: 'high',
        requirements: [
            'Custodian approval required',
            'Supervised access only',
        ],
        restrictions: [
            'Access only during ritual times',
            'Must be returned to vault after use',
        ],
        isActive: true,
        createdAt: '2020-05-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-004',
        updatedBy: 'emp-004',
    },
];

