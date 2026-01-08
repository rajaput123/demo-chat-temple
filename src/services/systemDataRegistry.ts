/**
 * System Data Registry
 * 
 * Central registry of all mock data sources for system-wide search
 */

// People Module
import { mockSringeriEmployees } from '@/data/mockEmployeeData';
import { mockPriests, mockRitualAssignments } from '@/data/mockPriestData';
import { mockVolunteers, mockVolunteerSchedules } from '@/data/mockVolunteerData';
import { mockFreelancers, mockFreelancerContracts } from '@/data/mockFreelancerData';
import { mockVIPProfiles } from '@/data/mockVIPData';

// Operations Module
import { mockActivities, mockTasks, mockBookings } from '@/data/mockOperationsData';
import { mockSevas, mockSevaBookings } from '@/data/mockSevaData';
import { mockDarshans, mockDarshanEntries } from '@/data/mockDarshanData';
import { mockTempleSchedules, mockRitualTimings } from '@/data/mockTempleData';
import { mockCrowdSnapshots, mockZones } from '@/data/mockCrowdData';

// Assets Module
import { mockAssets } from '@/data/mockAssetData';
import { mockCustodyRecords, mockAccessLogs } from '@/data/mockAssetSecurityData';
import { mockAssetMovements } from '@/data/mockAssetMovementData';
import { mockAssetMaintenance } from '@/data/mockAssetMaintenanceData';
import { mockAssetAudits } from '@/data/mockAssetAuditData';

// Finance Module
import { mockDonations, mockEightyGCertificates } from '@/data/mockDonationData';
import { mockExpenses } from '@/data/mockExpenseData';
import { mockBudgets } from '@/data/mockBudgetData';

// Projects Module
import { mockInfrastructureProjects, mockInfrastructureTasks } from '@/data/mockInfrastructureData';
import { mockEvents } from '@/data/mockEventData';
import { mockNavaratriPreparation } from '@/data/mockFestivalData';

// Inventory
import { mockInventoryItems, mockStockStatus } from '@/data/mockInventoryData';

export interface SystemRecord {
    id: string;
    type: string;
    name?: string;
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    status?: string;
    assignedTo?: string;
    departmentId?: string;
    [key: string]: any; // Allow additional fields
}

/**
 * Get all system records from all data sources
 */
export function getAllSystemRecords(): SystemRecord[] {
    const records: SystemRecord[] = [];

    // People Module
    mockSringeriEmployees.forEach(emp => {
        records.push({
            id: emp.id,
            type: 'employee',
            name: emp.name,
            email: emp.email,
            departmentId: emp.departmentId,
            status: emp.isActive ? 'active' : 'inactive',
        });
    });

    mockPriests.forEach(priest => {
        records.push({
            id: priest.id,
            type: 'priest',
            name: priest.name,
            departmentId: priest.departmentId,
            status: priest.isActive ? 'active' : 'inactive',
        });
    });

    mockVolunteers.forEach(vol => {
        records.push({
            id: vol.id,
            type: 'volunteer',
            name: vol.name,
            departmentId: vol.departmentId,
            status: vol.isActive ? 'active' : 'inactive',
        });
    });

    mockVIPProfiles.forEach(vip => {
        records.push({
            id: vip.id,
            type: 'vip',
            name: vip.name,
            title: vip.title,
            status: vip.isActive ? 'active' : 'inactive',
        });
    });

    // Operations Module
    mockActivities.forEach(activity => {
        records.push({
            id: activity.id,
            type: 'activity',
            name: activity.title,
            date: activity.startTime?.split('T')[0],
            time: activity.startTime?.split('T')[1]?.substring(0, 5),
            location: activity.location,
            status: activity.status,
        });
    });

    mockTasks.forEach(task => {
        records.push({
            id: task.id,
            type: 'task',
            name: task.title,
            status: task.status,
            assignedTo: task.assigneeId,
        });
    });

    mockSevaBookings.forEach(booking => {
        records.push({
            id: booking.id,
            type: 'seva-booking',
            name: booking.devoteeName,
            date: booking.bookingDate,
            time: booking.timeSlot,
            status: booking.status,
        });
    });

    mockDarshanEntries.forEach(entry => {
        records.push({
            id: entry.id,
            type: 'darshan-entry',
            name: entry.devoteeName,
            date: entry.entryTime?.split('T')[0],
            time: entry.entryTime?.split('T')[1]?.substring(0, 5),
            status: entry.status,
        });
    });

    // Assets Module
    mockAssets.forEach(asset => {
        records.push({
            id: asset.id,
            type: 'asset',
            name: asset.name,
            status: asset.lifecycleState,
            departmentId: asset.departmentId || undefined,
        });
    });

    // Finance Module
    mockDonations.forEach(donation => {
        records.push({
            id: donation.id,
            type: 'donation',
            name: donation.donorName,
            date: donation.transactionDate,
            status: donation.status,
            amount: donation.amount,
        });
    });

    mockExpenses.forEach(expense => {
        records.push({
            id: expense.id,
            type: 'expense',
            name: expense.vendorName,
            date: expense.transactionDate,
            status: expense.status,
            amount: expense.amount,
        });
    });

    // Projects Module
    mockInfrastructureProjects.forEach(project => {
        records.push({
            id: project.id,
            type: 'project',
            name: project.name,
            date: project.startDate,
            status: project.status,
        });
    });

    mockInfrastructureTasks.forEach(task => {
        records.push({
            id: task.id,
            type: 'project-task',
            name: task.title,
            date: task.dueDate,
            status: task.status,
            assignedTo: task.assignedToEmployeeId,
        });
    });

    mockEvents.forEach(event => {
        records.push({
            id: event.id,
            type: 'event',
            name: event.name,
            date: event.date,
            time: event.time,
            location: event.location,
            status: event.status,
        });
    });

    // Ritual assignments
    mockRitualAssignments.forEach(ritual => {
        records.push({
            id: ritual.id,
            type: 'ritual-assignment',
            name: ritual.ritualType,
            date: ritual.scheduledDate,
            time: ritual.scheduledTime,
            location: ritual.templeId,
            status: ritual.status,
        });
    });

    // Volunteer schedules
    mockVolunteerSchedules.forEach(schedule => {
        records.push({
            id: schedule.id,
            type: 'volunteer-schedule',
            date: schedule.date,
            time: schedule.startTime,
            status: schedule.status,
        });
    });

    // Temple schedules
    mockTempleSchedules.forEach(schedule => {
        records.push({
            id: schedule.id,
            type: 'temple-schedule',
            date: schedule.date,
        });
    });

    return records;
}

/**
 * Get records by type
 */
export function getRecordsByType(type: string): SystemRecord[] {
    return getAllSystemRecords().filter(record => record.type === type);
}

/**
 * Get records by date
 */
export function getRecordsByDate(date: string): SystemRecord[] {
    return getAllSystemRecords().filter(record => record.date === date);
}

/**
 * Get records by name (fuzzy match)
 */
export function getRecordsByName(name: string): SystemRecord[] {
    const searchName = name.toLowerCase();
    return getAllSystemRecords().filter(record => {
        const recordName = (record.name || record.title || '').toLowerCase();
        return recordName.includes(searchName) || searchName.includes(recordName);
    });
}

