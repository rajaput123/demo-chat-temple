/**
 * Mock Data for Infrastructure & Renovation Projects
 * 
 * Realistic infrastructure project data for Sringeri Sharada Peetham
 */

import { Project, ProjectTask, SafetyCompliance } from '@/types/project';

export const mockInfrastructureProjects: Project[] = [
    {
        id: 'proj-infra-001',
        name: 'Temple Renovation - Main Hall',
        type: 'renovation',
        description: 'Comprehensive renovation of main temple hall including structural repairs and aesthetic enhancements',
        status: 'in-progress',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        departmentId: 'dept-003',
        budgetId: 'budget-005',
        coordinatorId: 'emp-004',
        createdAt: '2023-12-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-004',
        updatedBy: 'emp-004',
    },
    {
        id: 'proj-infra-002',
        name: 'Veda Pathashala Building Expansion',
        type: 'infrastructure',
        description: 'Construction of new building wing for Veda Pathashala to accommodate more students',
        status: 'approved',
        startDate: '2024-03-01',
        endDate: '2024-12-31',
        departmentId: 'dept-001',
        budgetId: 'budget-006',
        coordinatorId: 'emp-001',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'emp-001',
        updatedBy: 'emp-001',
    },
    {
        id: 'proj-infra-003',
        name: 'Parking Facility Development',
        type: 'infrastructure',
        description: 'Development of new parking facility to accommodate increasing visitor traffic',
        status: 'planning',
        startDate: '2024-06-01',
        endDate: '2024-12-31',
        departmentId: 'dept-004',
        budgetId: 'budget-007',
        coordinatorId: 'emp-006',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        createdBy: 'emp-006',
        updatedBy: 'emp-006',
    },
];

export const mockInfrastructureTasks: ProjectTask[] = [
    {
        id: 'task-infra-001',
        projectId: 'proj-infra-001',
        title: 'Structural Assessment',
        description: 'Complete structural assessment of main temple hall',
        assignedToDepartmentId: 'dept-003',
        assignedToEmployeeId: 'emp-004',
        status: 'completed',
        dueDate: '2024-01-15',
        completedAt: '2024-01-14T10:00:00Z',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-14T10:00:00Z',
    },
    {
        id: 'task-infra-002',
        projectId: 'proj-infra-001',
        title: 'Material Procurement',
        description: 'Procure renovation materials including wood, stone, and decorative elements',
        assignedToDepartmentId: 'dept-003',
        assignedToEmployeeId: 'emp-004',
        status: 'in-progress',
        dueDate: '2024-02-15',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'task-infra-003',
        projectId: 'proj-infra-002',
        title: 'Architectural Design Approval',
        description: 'Finalize and approve architectural design for new building wing',
        assignedToDepartmentId: 'dept-001',
        status: 'in-progress',
        dueDate: '2024-02-28',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
    },
];

export const mockInfrastructureCompliance: SafetyCompliance[] = [
    {
        id: 'comp-infra-001',
        projectId: 'proj-infra-001',
        complianceType: 'safety',
        requirement: 'Safety permits for renovation work',
        status: 'approved',
        submittedAt: '2024-01-05T10:00:00Z',
        approvedAt: '2024-01-10T10:00:00Z',
        approvedBy: 'emp-004',
        documentUrl: '/documents/compliance/safety-permit-renovation.pdf',
    },
    {
        id: 'comp-infra-002',
        projectId: 'proj-infra-002',
        complianceType: 'legal',
        requirement: 'Building construction permits',
        status: 'pending',
        submittedAt: '2024-01-15T10:00:00Z',
        documentUrl: '/documents/compliance/building-permit-application.pdf',
    },
    {
        id: 'comp-infra-003',
        projectId: 'proj-infra-001',
        complianceType: 'environmental',
        requirement: 'Environmental impact assessment',
        status: 'approved',
        submittedAt: '2023-12-20T10:00:00Z',
        approvedAt: '2024-01-01T10:00:00Z',
        approvedBy: 'emp-004',
        documentUrl: '/documents/compliance/environmental-assessment.pdf',
    },
];

