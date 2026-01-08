/**
 * Inventory Check Handler
 * Handles inventory/resource check queries (chat only, no canvas update)
 */

export interface InventoryCheckResult {
    handled: boolean;
    response?: string;
}

/**
 * Handle inventory/resource check queries
 */
export function handleInventoryCheck(query: string): InventoryCheckResult {
    const lowercaseQuery = query.toLowerCase();

    // Check if this is an inventory check query
    const isInventoryCheck = lowercaseQuery.includes('check stock') ||
        lowercaseQuery.includes('check inventory') ||
        lowercaseQuery.includes('do we have') ||
        (lowercaseQuery.includes('available') && lowercaseQuery.includes('?'));

    if (!isInventoryCheck) {
        return { handled: false };
    }

    // Generate response based on query content
    let response = "Checking system records...";

    if (lowercaseQuery.includes('cane') || lowercaseQuery.includes('sugarcane')) {
        response = "Yes, verified. We have 40 tons of fresh sugarcane delivered this morning. Storage yard is optimal.";
    } else if (lowercaseQuery.includes('equipment') || lowercaseQuery.includes('machinery')) {
        response = "Inventory check confirms 200 units of processing equipment are available in the Maintenance Shed. 50 more are currently in use at the Production Floor.";
    } else if (lowercaseQuery.includes('sugar') || lowercaseQuery.includes('product')) {
        response = "Production reports 5,000 bags of sugar packed and ready for dispatch. Raw material stock is sufficient for another 15,000 bags.";
    } else if (lowercaseQuery.includes('quality') || lowercaseQuery.includes('inspection')) {
        response = "Staffing logs show 12 quality control staff currently on duty at Main Gate. 4 relief inspectors are available in the quality lab.";
    } else {
        response = "I've checked the inventory database. The requested resources are marked as 'Available' and can be allocated to your plan.";
    }

    return {
        handled: true,
        response
    };
}

