/**
 * Mock Data for Budgeting & Forecasting
 * 
 * Realistic budget data for Sringeri Sharada Peetham
 */

import { Budget } from '@/types/finance';

export const mockBudgets: Budget[] = [
    {
        id: 'budget-001',
        departmentId: 'dept-001',
        fiscalYear: '2024-2025',
        category: 'ritual-materials',
        allocatedAmount: 500000,
        spentAmount: 125000,
        remainingAmount: 375000,
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'budget-002',
        departmentId: 'dept-004',
        fiscalYear: '2024-2025',
        category: 'kitchen-operations',
        allocatedAmount: 2000000,
        spentAmount: 450000,
        remainingAmount: 1550000,
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'budget-003',
        departmentId: 'dept-003',
        fiscalYear: '2024-2025',
        category: 'maintenance',
        allocatedAmount: 1000000,
        spentAmount: 250000,
        remainingAmount: 750000,
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'budget-004',
        departmentId: 'dept-002',
        fiscalYear: '2024-2025',
        category: 'administrative',
        allocatedAmount: 500000,
        spentAmount: 150000,
        remainingAmount: 350000,
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'budget-005',
        departmentId: 'dept-001',
        projectId: 'proj-festival-001',
        fiscalYear: '2024-2025',
        category: 'festival',
        allocatedAmount: 500000,
        spentAmount: 200000,
        remainingAmount: 300000,
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

export interface BudgetForecast {
    id: string;
    departmentId: string;
    fiscalYear: string;
    category: string;
    forecastedAmount: number;
    actualAmount?: number;
    variance?: number;
    forecastDate: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export const mockBudgetForecasts: BudgetForecast[] = [
    {
        id: 'forecast-001',
        departmentId: 'dept-001',
        fiscalYear: '2024-2025',
        category: 'ritual-materials',
        forecastedAmount: 600000,
        actualAmount: 500000,
        variance: -100000,
        forecastDate: '2024-04-01',
        notes: 'Forecast adjusted based on actual spending patterns',
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'forecast-002',
        departmentId: 'dept-004',
        fiscalYear: '2024-2025',
        category: 'kitchen-operations',
        forecastedAmount: 2200000,
        actualAmount: 2000000,
        variance: -200000,
        forecastDate: '2024-04-01',
        notes: 'Kitchen operations within budget',
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
];

