/**
 * InfoCard Generation Service
 * 
 * Generates InfoCard data from system data search results
 * Uses ONLY existing system mock data - NO new record creation
 */

import { searchSystemData, formatSearchResultForInfoCard } from './systemDataSearch';
import { InfoCardData } from '@/types/planner';

/**
 * Generate InfoCard data from system data search (MANDATORY for every query)
 * Returns content in sentence format related to the query
 */
export function generateInfoCard(query: string, systemData?: any): InfoCardData {
    // systemData should already be formatted from formatSearchResultForInfoCard
    if (!systemData) {
        const search = searchSystemData(query);
        systemData = formatSearchResultForInfoCard(search);
    }
    
    const lowerQuery = query.toLowerCase();
    let content = '';
    
    // If no match found, show "New/Unregistered" status
    if (!systemData.recordType || systemData.recordType === 'New / Unregistered') {
        // Generate sentence based on query intent
        if (lowerQuery.includes('visit') || lowerQuery.includes('visiting')) {
            content = 'No existing visit record found in the system. This appears to be a new or unregistered visit that needs to be created.';
        } else if (lowerQuery.includes('meeting') || lowerQuery.includes('appointment')) {
            content = 'No existing meeting or appointment record found. This appears to be a new appointment that needs to be scheduled.';
        } else if (lowerQuery.includes('task') || lowerQuery.includes('work')) {
            content = 'No existing task record found. This appears to be a new task that needs to be created and assigned.';
        } else if (lowerQuery.includes('donation') || lowerQuery.includes('expense')) {
            content = 'No existing financial record found. This appears to be a new transaction that needs to be recorded.';
        } else if (lowerQuery.includes('employee') || lowerQuery.includes('staff') || lowerQuery.includes('priest')) {
            content = 'No existing employee or staff record found. This appears to be a new person that needs to be registered in the system.';
        } else {
            content = 'No existing record found in the system. This appears to be a new or unregistered item that needs to be created.';
        }
    } else {
        // Build sentence format from matched system data
        const sentences: string[] = [];
        
        // Start with record identification
        if (systemData.name || systemData.title) {
            const name = systemData.name || systemData.title;
            if (systemData.recordType === 'employee' || systemData.recordType === 'priest' || systemData.recordType === 'volunteer') {
                sentences.push(`${name} is ${systemData.status === 'active' ? 'an active' : 'an inactive'} ${systemData.recordType} in the system.`);
            } else if (systemData.recordType === 'vip') {
                sentences.push(`${name}${systemData.title ? ` (${systemData.title})` : ''} is ${systemData.status === 'active' ? 'an active' : 'an inactive'} VIP in the system.`);
            } else if (systemData.recordType === 'activity' || systemData.recordType === 'event') {
                sentences.push(`The ${systemData.recordType} "${name}" is currently ${systemData.status || 'scheduled'} in the system.`);
            } else if (systemData.recordType === 'task') {
                sentences.push(`The task "${name}" is currently ${systemData.status || 'pending'} in the system.`);
            } else if (systemData.recordType === 'seva-booking' || systemData.recordType === 'darshan-entry') {
                sentences.push(`A ${systemData.recordType.replace('-', ' ')} for ${name} is ${systemData.status || 'pending'} in the system.`);
            } else if (systemData.recordType === 'donation' || systemData.recordType === 'expense') {
                sentences.push(`A ${systemData.recordType} record for ${name} is ${systemData.status || 'pending'} in the system.`);
            } else if (systemData.recordType === 'project') {
                sentences.push(`The project "${name}" is currently ${systemData.status || 'in progress'} in the system.`);
            } else {
                sentences.push(`A ${systemData.recordType.replace(/-/g, ' ')} record for ${name} exists in the system.`);
            }
        } else {
            sentences.push(`A ${systemData.recordType.replace(/-/g, ' ')} record exists in the system.`);
        }
        
        // Add date information
        if (systemData.date) {
            const dateObj = new Date(systemData.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (systemData.date === today.toISOString().split('T')[0]) {
                sentences.push(`It is scheduled for today.`);
            } else if (systemData.date === tomorrow.toISOString().split('T')[0]) {
                sentences.push(`It is scheduled for tomorrow.`);
            } else {
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                sentences.push(`It is scheduled for ${formattedDate}.`);
            }
        }
        
        // Add time information
        if (systemData.time) {
            sentences.push(`The scheduled time is ${systemData.time}.`);
        }
        
        // Add location information
        if (systemData.location) {
            sentences.push(`It is located at ${systemData.location}.`);
        }
        
        // Add assignment information
        if (systemData.assignedRoles) {
            sentences.push(`It is assigned to ${systemData.assignedRoles}.`);
        }
        
        // Add status details
        if (systemData.status) {
            if (systemData.status === 'pending' || systemData.status === 'pending-approval') {
                sentences.push(`The current status is pending and requires attention.`);
            } else if (systemData.status === 'scheduled') {
                sentences.push(`It is confirmed and scheduled.`);
            } else if (systemData.status === 'completed') {
                sentences.push(`It has been completed.`);
            } else if (systemData.status === 'in-progress' || systemData.status === 'active') {
                sentences.push(`It is currently active.`);
            }
        }
        
        // Add missing information
        if (systemData.missingInformation && systemData.missingInformation.length > 0) {
            sentences.push(`Note: ${systemData.missingInformation.join(', ').toLowerCase()}.`);
        }
        
        content = sentences.join(' ');
    }
    
    // If no content generated, provide default
    if (!content || content.trim().length === 0) {
        content = 'System record information is available.';
    }
    
    // Extract structured data for card display
    const cardData = {
        recordType: systemData.recordType || 'New / Unregistered',
        name: systemData.name || systemData.title || null,
        date: systemData.date || null,
        time: systemData.time || null,
        location: systemData.location || null,
        status: systemData.status || null,
        assignedRoles: systemData.assignedRoles || null,
        department: systemData.departmentId || null,
    };
    
    return {
        id: `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: 'System Record',
        content,
        visibleContent: content, // Instant render - no streaming
        type: 'info',
        metadata: cardData, // Store structured data for card display
    };
}

