/**
 * Data Lookup Service - Sugarcane Factory
 * 
 * Searches through all mock data sources to find relevant information
 * for chat queries
 */

import { mockInventoryItems, mockStockStatus } from '@/data/mockInventoryData';
import { mockDailyPlan, mockBatches, mockQualityChecks, mockDistribution, mockKitchenMenus } from '@/data/mockKitchenData';
import { mockActivities, mockTasks, mockFacilities, mockResources } from '@/data/mockOperationsData';
import { mockSringeriEmployees } from '@/data/mockEmployeeData';
import { mockFestivalData } from '@/data/mockFestivalData';
import { mockDevotees } from '@/data/mockDevoteeData';
import { mockLocations } from '@/data/mockLocationData';
import { mockEvents } from '@/data/mockEventData';

export interface DataLookupResult {
    type: 'employee' | 'department' | 'inventory' | 'kitchen' | 'operation' | 'festival' | 'event' | 'devotee' | 'location' | 'vip' | 'none';
    data: any[];
    query: string;
}

export class DataLookupService {
    /**
     * Main lookup function - tries all search functions
     */
    static lookupData(query: string): DataLookupResult {
        const lowerQuery = query.toLowerCase();

        // Try each search function
        const results = [
            this.searchEmployees(lowerQuery),
            this.searchDepartments(lowerQuery),
            this.searchInventory(lowerQuery),
            this.searchKitchen(lowerQuery),
            this.searchOperations(lowerQuery),
            this.searchFestivals(lowerQuery),
            this.searchEvents(lowerQuery),
            this.searchDevotees(lowerQuery),
            this.searchLocations(lowerQuery),
        ];

        // Return first non-empty result, or none
        for (const result of results) {
            if (result.data.length > 0) {
                return result;
            }
        }

        return { type: 'none', data: [], query };
    }

    /**
     * Search employees by name, department, role
     */
    static searchEmployees(query: string): DataLookupResult {
        const results = mockSringeriEmployees.filter(emp => {
            const nameMatch = emp.name.toLowerCase().includes(query);
            const emailMatch = emp.email?.toLowerCase().includes(query);
            const deptMatch = emp.departmentId?.toLowerCase().includes(query);
            const roleMatch = emp.employeeId?.toLowerCase().includes(query);
            
            return nameMatch || emailMatch || deptMatch || roleMatch;
        });

        return { type: 'employee', data: results, query };
    }

    /**
     * Search departments
     */
    static searchDepartments(query: string): DataLookupResult {
        // Extract department names from employees
        const departments = new Set<string>();
        mockSringeriEmployees.forEach(emp => {
            if (emp.departmentId) {
                departments.add(emp.departmentId);
            }
        });

        const deptNames = [
            'Production Department',
            'Quality Control Lab',
            'Finance & Accounts',
            'Safety & Compliance',
            'Operations & Workflow',
            'Inventory Department',
            'Maintenance Department'
        ];

        const results = deptNames.filter(dept => 
            dept.toLowerCase().includes(query) ||
            query.includes('department') ||
            query.includes('dept')
        );

        return { type: 'department', data: results, query };
    }

    /**
     * Search inventory items and stock status
     */
    static searchInventory(query: string): DataLookupResult {
        const itemResults = mockInventoryItems.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(query);
            const categoryMatch = item.category.toLowerCase().includes(query);
            const descMatch = item.description?.toLowerCase().includes(query);
            
            return nameMatch || categoryMatch || descMatch;
        });

        const stockResults = mockStockStatus.filter(stock => {
            const nameMatch = stock.itemName.toLowerCase().includes(query);
            const statusMatch = stock.status.toLowerCase().includes(query);
            
            return nameMatch || statusMatch;
        });

        return { 
            type: 'inventory', 
            data: [...itemResults, ...stockResults], 
            query 
        };
    }

    /**
     * Search kitchen data (plans, batches, recipes, menus)
     */
    static searchKitchen(query: string): DataLookupResult {
        const results: any[] = [];

        // Check daily plan
        if (query.includes('plan') || query.includes('prasad') || query.includes('annadanam')) {
            results.push(mockDailyPlan);
        }

        // Check menus
        if (query.includes('menu')) {
            if (query.includes('prasad')) {
                const prasadMenu = mockKitchenMenus.find(m => m.type === 'prasad');
                if (prasadMenu) results.push(prasadMenu);
            } else if (query.includes('annadanam')) {
                const annadanamMenu = mockKitchenMenus.find(m => m.type === 'annadanam');
                if (annadanamMenu) results.push(annadanamMenu);
            } else if (query.includes('breakfast')) {
                const breakfastMenu = mockKitchenMenus.find(m => m.type === 'breakfast');
                if (breakfastMenu) results.push(breakfastMenu);
            } else if (query.includes('lunch')) {
                const lunchMenu = mockKitchenMenus.find(m => m.type === 'lunch');
                if (lunchMenu) results.push(lunchMenu);
            } else if (query.includes('dinner')) {
                const dinnerMenu = mockKitchenMenus.find(m => m.type === 'dinner');
                if (dinnerMenu) results.push(dinnerMenu);
            } else {
                // Return all menus
                results.push(...mockKitchenMenus);
            }
        }

        // Check batches
        if (query.includes('batch') || query.includes('cooking') || query.includes('production')) {
            results.push(...mockBatches);
        }

        // Check quality checks
        if (query.includes('quality') || query.includes('check') || query.includes('inspection')) {
            results.push(...mockQualityChecks);
        }

        // Check distribution
        if (query.includes('distribution') || query.includes('serving') || query.includes('meals')) {
            results.push(mockDistribution);
        }

        return { type: 'kitchen', data: results, query };
    }

    /**
     * Search operations (activities, tasks, facilities)
     */
    static searchOperations(query: string): DataLookupResult {
        const results: any[] = [];

        // Check activities
        if (query.includes('activity') || query.includes('aarti') || query.includes('ritual') || query.includes('seva')) {
            results.push(...mockActivities);
        }

        // Check tasks
        if (query.includes('task') || query.includes('work') || query.includes('assignment')) {
            results.push(...mockTasks);
        }

        // Check facilities
        if (query.includes('facility') || query.includes('hall') || query.includes('room') || query.includes('accommodation')) {
            results.push(...mockFacilities);
        }

        // Check resources
        if (query.includes('resource') || query.includes('operator') || query.includes('staff')) {
            results.push(...mockResources);
        }

        return { type: 'operation', data: results, query };
    }

    /**
     * Search production seasons (Crushing Season, etc.)
     */
    static searchFestivals(query: string): DataLookupResult {
        const results = mockFestivalData.filter(season => {
            const nameMatch = season.festivalName?.toLowerCase().includes(query);
            const actionMatch = season.actions?.some(action => 
                action.description.toLowerCase().includes(query)
            );
            
            return nameMatch || actionMatch || query.includes('season') || query.includes('harvest');
        });

        return { type: 'festival', data: results, query };
    }

    /**
     * Search events (Production batches, quality checks, inspections)
     */
    static searchEvents(query: string): DataLookupResult {
        const results = mockEvents.filter(event => {
            const nameMatch = event.name.toLowerCase().includes(query);
            const typeMatch = event.type.toLowerCase().includes(query);
            const descMatch = event.description.toLowerCase().includes(query);
            const locationMatch = event.location.toLowerCase().includes(query);
            
            return nameMatch || typeMatch || descMatch || locationMatch ||
                   query.includes('batch') || query.includes('production') || query.includes('inspection');
        });

        return { type: 'event', data: results, query };
    }

    /**
     * Search suppliers/farmers
     */
    static searchDevotees(query: string): DataLookupResult {
        const results = mockDevotees.filter(supplier => {
            const nameMatch = supplier.name.toLowerCase().includes(query);
            const phoneMatch = supplier.phone?.toLowerCase().includes(query);
            const emailMatch = supplier.email?.toLowerCase().includes(query);
            
            return nameMatch || phoneMatch || emailMatch || query.includes('supplier') || query.includes('farmer');
        });

        return { type: 'devotee', data: results, query };
    }

    /**
     * Search locations (Factory, Cane Field, facilities)
     */
    static searchLocations(query: string): DataLookupResult {
        const results = mockLocations.filter(location => {
            const nameMatch = location.name.toLowerCase().includes(query);
            const typeMatch = location.type.toLowerCase().includes(query);
            const descMatch = location.description.toLowerCase().includes(query);
            const addressMatch = location.address?.toLowerCase().includes(query);
            
            return nameMatch || typeMatch || descMatch || addressMatch ||
                   query.includes('factory') || query.includes('cane') || query.includes('field');
        });

        return { type: 'location', data: results, query };
    }

    /**
     * Format data for display based on type
     */
    static formatDataForDisplay(result: DataLookupResult): string {
        if (result.data.length === 0) {
            return 'No data found.';
        }

        switch (result.type) {
            case 'employee':
                return this.formatEmployees(result.data);
            case 'inventory':
                return this.formatInventory(result.data);
            case 'kitchen':
                return this.formatKitchen(result.data);
            case 'festival':
                return this.formatFestivals(result.data);
            case 'event':
                return this.formatEvents(result.data);
            case 'devotee':
                return this.formatDevotees(result.data);
            case 'location':
                return this.formatLocations(result.data);
            default:
                return JSON.stringify(result.data, null, 2);
        }
    }

    private static formatEmployees(data: any[]): string {
        return data.map(emp => 
            `- ${emp.name} (${emp.employeeId}) - ${emp.departmentId || 'No Department'}`
        ).join('\n');
    }

    private static formatInventory(data: any[]): string {
        return data.map(item => {
            if (item.itemName) {
                // Stock status
                return `- ${item.itemName}: ${item.currentStock} ${item.unit} (Status: ${item.status})`;
            } else {
                // Inventory item
                return `- ${item.name} (${item.category}): ${item.unit} - ${item.description}`;
            }
        }).join('\n');
    }

    private static formatKitchen(data: any[]): string {
        if (data.length === 0) return 'No kitchen data found.';
        
        const formatted: string[] = [];
        data.forEach(item => {
            if (item.items && item.type) {
                // Menu
                formatted.push(`**${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Menu:**`);
                item.items.forEach((menuItem: any) => {
                    formatted.push(`  - ${menuItem.name}${menuItem.description ? ` (${menuItem.description})` : ''}`);
                });
            } else if (item.plannedItems) {
                // Daily plan
                formatted.push('Daily Plan:');
                item.plannedItems.forEach((pi: any) => {
                    formatted.push(`  - ${pi.recipeName}: ${pi.targetQuantity} ${pi.unit}`);
                });
            } else if (item.recipeName) {
                // Batch
                formatted.push(`Batch: ${item.recipeName} - Status: ${item.status}`);
            } else if (item.status) {
                // Distribution
                formatted.push(`Distribution: ${item.mealsServed}/${item.mealsPrepared} meals served`);
            }
        });
        
        return formatted.join('\n');
    }

    private static formatFestivals(data: any[]): string {
        return data.map(fest => {
            let output = `${fest.festivalName} (${fest.progress}% complete)\n`;
            output += `Actions:\n`;
            fest.actions.forEach((action: any) => {
                output += `  - ${action.description} [${action.status}]\n`;
            });
            return output;
        }).join('\n');
    }

    private static formatEvents(data: any[]): string {
        return data.map(event => 
            `- ${event.name} (${event.type}) - ${event.date} at ${event.location}`
        ).join('\n');
    }

    private static formatDevotees(data: any[]): string {
        return data.map(dev => 
            `- ${dev.name} (${dev.visitFrequency}) - ${dev.sevaBookings.length} seva bookings`
        ).join('\n');
    }

    private static formatLocations(data: any[]): string {
        return data.map(loc => 
            `- ${loc.name} (${loc.type}) - ${loc.description}`
        ).join('\n');
    }
}

