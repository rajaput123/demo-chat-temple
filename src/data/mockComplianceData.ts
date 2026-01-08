/**
 * Mock Data for Compliance & Legal (80G)
 * 
 * Realistic compliance data for Sringeri Sharada Peetham
 */

export interface ComplianceRecord {
    id: string;
    type: '80g-certificate' | 'tax-filing' | 'audit-report' | 'legal-document';
    title: string;
    description: string;
    documentUrl?: string;
    issueDate?: string;
    expiryDate?: string;
    status: 'active' | 'expired' | 'pending' | 'renewed';
    departmentId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface TaxFiling {
    id: string;
    financialYear: string;
    filingType: 'income-tax' | 'gst' | 'tds';
    filingDate: string;
    dueDate: string;
    status: 'filed' | 'pending' | 'overdue';
    documentUrl?: string;
    amount?: number;
    departmentId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface AuditReport {
    id: string;
    auditYear: string;
    auditType: 'internal' | 'external' | 'statutory';
    auditorName: string;
    auditDate: string;
    reportUrl?: string;
    findings?: string;
    status: 'draft' | 'final' | 'approved';
    departmentId: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export const mockComplianceRecords: ComplianceRecord[] = [
    {
        id: 'comp-001',
        type: '80g-certificate',
        title: '80G Registration Certificate',
        description: 'Valid 80G registration certificate for tax exemption',
        documentUrl: '/documents/80g-certificate.pdf',
        issueDate: '2020-04-01',
        expiryDate: '2025-03-31',
        status: 'active',
        departmentId: 'dept-002',
        createdAt: '2020-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
    {
        id: 'comp-002',
        type: 'legal-document',
        title: 'Temple Trust Deed',
        description: 'Original trust deed establishing the temple trust',
        documentUrl: '/documents/trust-deed.pdf',
        issueDate: '1950-01-01',
        status: 'active',
        departmentId: 'dept-002',
        createdAt: '1950-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
    {
        id: 'comp-003',
        type: 'legal-document',
        title: 'Land Ownership Documents',
        description: 'Property ownership documents for temple premises',
        documentUrl: '/documents/land-ownership.pdf',
        issueDate: '1950-01-01',
        status: 'active',
        departmentId: 'dept-002',
        createdAt: '1950-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin',
        updatedBy: 'admin',
    },
];

export const mockTaxFilings: TaxFiling[] = [
    {
        id: 'tax-001',
        financialYear: '2023-2024',
        filingType: 'income-tax',
        filingDate: '2024-07-15',
        dueDate: '2024-07-31',
        status: 'filed',
        documentUrl: '/documents/it-return-2023-24.pdf',
        amount: 0,
        departmentId: 'dept-002',
        createdAt: '2024-07-15T10:00:00Z',
        updatedAt: '2024-07-15T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
    {
        id: 'tax-002',
        financialYear: '2024-2025',
        filingType: 'gst',
        filingDate: '2024-01-20',
        dueDate: '2024-01-20',
        status: 'filed',
        documentUrl: '/documents/gst-return-jan-2024.pdf',
        departmentId: 'dept-002',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
    {
        id: 'tax-003',
        financialYear: '2024-2025',
        filingType: 'tds',
        filingDate: '2024-01-31',
        dueDate: '2024-01-31',
        status: 'filed',
        documentUrl: '/documents/tds-return-jan-2024.pdf',
        departmentId: 'dept-002',
        createdAt: '2024-01-31T10:00:00Z',
        updatedAt: '2024-01-31T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
];

export const mockAuditReports: AuditReport[] = [
    {
        id: 'audit-001',
        auditYear: '2023-2024',
        auditType: 'statutory',
        auditorName: 'Chartered Accountants & Co.',
        auditDate: '2024-06-30',
        reportUrl: '/documents/audit-report-2023-24.pdf',
        findings: 'All financial records are in order. No discrepancies found.',
        status: 'approved',
        departmentId: 'dept-002',
        createdAt: '2024-06-30T10:00:00Z',
        updatedAt: '2024-07-15T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
    {
        id: 'audit-002',
        auditYear: '2024-2025',
        auditType: 'internal',
        auditorName: 'Internal Audit Team',
        auditDate: '2024-01-15',
        reportUrl: '/documents/internal-audit-q3-2024.pdf',
        findings: 'Minor recommendations for process improvements',
        status: 'final',
        departmentId: 'dept-002',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        createdBy: 'emp-002',
        updatedBy: 'emp-002',
    },
];

