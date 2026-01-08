/**
 * Mock Data for Locations - Sugarcane Factory
 * 
 * Factory locations including main factory complex, cane yard, and processing units
 */

export interface FactoryLocation {
    id: string;
    name: string;
    type: 'production' | 'facility' | 'storage' | 'office' | 'other';
    description: string;
    address?: string;
    capacity?: number;
    status: 'operational' | 'under-maintenance' | 'closed';
    associatedWith?: string; // Associated department, purpose, etc.
}

export const mockLocations: FactoryLocation[] = [
    {
        id: 'loc-factory-main',
        name: 'Main Factory Complex',
        type: 'production',
        description: 'Main factory complex housing crushing unit and production floor',
        address: 'Factory District, Industrial Area, Karnataka',
        status: 'operational',
        associatedWith: 'Production, Quality Control'
    },
    {
        id: 'loc-crushing-unit',
        name: 'Crushing Unit',
        type: 'production',
        description: 'Primary crushing unit for sugarcane processing',
        address: 'Main Factory Complex',
        status: 'operational',
        associatedWith: 'Production Department'
    },
    {
        id: 'loc-production-floor',
        name: 'Production Floor',
        type: 'production',
        description: 'Main production floor for sugar processing and packaging',
        address: 'Main Factory Complex',
        status: 'operational',
        associatedWith: 'Production Department'
    },
    {
        id: 'loc-cane-field',
        name: 'Cane Field',
        type: 'storage',
        description: 'Cane field location, often visited by Factory Manager for quality inspection',
        address: 'Cane Field, near Factory',
        status: 'operational',
        associatedWith: 'Factory Manager visits'
    },
    {
        id: 'loc-guest-house',
        name: 'Guest House',
        type: 'facility',
        description: 'Accommodation facility for visiting suppliers and inspectors',
        capacity: 50,
        status: 'operational'
    },
    {
        id: 'loc-canteen',
        name: 'Factory Canteen',
        type: 'facility',
        description: 'Dining hall for factory staff and visitors',
        capacity: 500,
        status: 'operational'
    },
    {
        id: 'loc-quality-lab',
        name: 'Quality Control Lab',
        type: 'facility',
        description: 'Laboratory for quality testing and inspection',
        status: 'operational',
        associatedWith: 'Quality Control'
    },
    {
        id: 'loc-storage-hall',
        name: 'Product Storage Hall',
        type: 'storage',
        description: 'Hall for storing finished sugar products',
        capacity: 200,
        status: 'operational'
    },
    {
        id: 'loc-conference-room',
        name: 'Conference Room',
        type: 'office',
        description: 'Main conference room for meetings and briefings',
        capacity: 100,
        status: 'operational'
    },
    {
        id: 'loc-parking',
        name: 'Factory Parking Area',
        type: 'facility',
        description: 'Parking facility for staff and visitor vehicles',
        capacity: 150,
        status: 'operational'
    }
];

