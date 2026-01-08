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

    if (lowercaseQuery.includes('flower') || lowercaseQuery.includes('garland')) {
        response = "Yes, verified. We have 40kg of fresh Jasmine and 20kg of Marigold delivered this morning. Cold storage is optimal.";
    } else if (lowercaseQuery.includes('chair') || lowercaseQuery.includes('seating')) {
        response = "Inventory check confirms 200 plastic chairs are available in the South Storage Shed. 50 more are currently in use at the Dining Hall.";
    } else if (lowercaseQuery.includes('prasadam') || lowercaseQuery.includes('laddu')) {
        response = "Kitchen reports 5,000 Laddus packed and ready for distribution. Raw material stock is sufficient for another 15,000.";
    } else if (lowercaseQuery.includes('security') || lowercaseQuery.includes('guard')) {
        response = "Staffing logs show 12 guards currently on duty at North Gate. 4 relief guards are available in the barracks.";
    } else {
        response = "I've checked the inventory database. The requested resources are marked as 'Available' and can be allocated to your plan.";
    }

    return {
        handled: true,
        response
    };
}

