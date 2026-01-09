/**
 * Calendar Aggregator Service
 * 
 * Combines data from CEO calendar, Shriguru calendar, and Temple master calendar
 * into a single chronological list for info cards.
 */

export interface CalendarItem {
    time: string;
    description: string;
    context?: string; // Optional second line for brief context
    source: 'ceo' | 'shriguru' | 'temple';
}

/**
 * Aggregate calendars and return 4-5 most relevant items chronologically
 */
export function aggregateCalendars(query: string, date?: Date): CalendarItem[] {
    const targetDate = date || new Date();
    const lowercaseQuery = query.toLowerCase();

    const allItems: CalendarItem[] = [];

    // Get CEO calendar events
    const ceoItems = getCEOCalendarEvents(targetDate, lowercaseQuery);
    allItems.push(...ceoItems);

    // Get Shriguru calendar events
    const shriguruItems = getShriguruCalendarEvents(targetDate, lowercaseQuery);
    allItems.push(...shriguruItems);

    // Get Temple master calendar events
    const templeItems = getTempleCalendarEvents(targetDate, lowercaseQuery);
    allItems.push(...templeItems);

    // Special handling for Ekadashi queries
    if (lowercaseQuery.includes('ekadashi')) {
        const ekadashiItems = getEkadashiSchedule(targetDate);
        allItems.push(...ekadashiItems);
    }

    // Sort chronologically by time
    allItems.sort((a, b) => {
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return timeA - timeB;
    });

    // Return 4-5 most relevant items
    return allItems.slice(0, 5);
}

/**
 * Get CEO calendar events
 */
function getCEOCalendarEvents(date: Date, query: string): CalendarItem[] {
    const items: CalendarItem[] = [];

    // VIP visits - extract time from query if present
    if (query.includes('vip') || query.includes('minister') || query.includes('visit')) {
        // Try to extract time from query (e.g., "9pm", "9 pm", "21:00")
        let visitTime = '09:00 PM'; // Default
        const timeMatch = query.match(/(\d{1,2})\s*(pm|am|:00\s*(pm|am))/i);
        if (timeMatch) {
            const hour = parseInt(timeMatch[1]);
            const period = timeMatch[2]?.toUpperCase() || timeMatch[3]?.toUpperCase() || 'PM';
            visitTime = `${hour}:00 ${period}`;
        }
        
        items.push({
            time: visitTime,
            description: 'VIP Darshan for Prime Minister Modi',
            source: 'ceo'
        });
    }

    // Executive meetings
    if (query.includes('meeting') || query.includes('executive')) {
        items.push({
            time: '10:00 AM',
            description: 'Executive Review Meeting',
            source: 'ceo'
        });
    }

    // Approval requests
    if (query.includes('approval') || query.includes('approve')) {
        items.push({
            time: '11:00 AM',
            description: 'Pending Approval Review',
            source: 'ceo'
        });
    }

    // Default CEO calendar items
    items.push({
        time: '08:30 AM',
        description: 'Security Briefing with Police Chief',
        source: 'ceo'
    });

    items.push({
        time: '02:00 PM',
        description: 'Internal Review Meeting',
        source: 'ceo'
    });

    return items;
}

/**
 * Get Shriguru calendar events
 */
function getShriguruCalendarEvents(date: Date, query: string): CalendarItem[] {
    const items: CalendarItem[] = [];

    // Morning Anushtana (always present)
    items.push({
        time: '07:00 AM',
        description: 'Sri Gurugalu will perform the Morning Anushtana as part of the daily spiritual observances',
        source: 'shriguru'
    });

    // Evening Discourse (always present)
    items.push({
        time: '04:00 PM',
        description: 'Sri Gurugalu will deliver the Evening Discourse, offering spiritual guidance and blessings to devotees',
        source: 'shriguru'
    });

    // VIP Darshan (if VIP query)
    if (query.includes('vip') || query.includes('minister') || query.includes('visit')) {
        items.push({
            time: '09:30 AM',
            description: 'VIP Darshan is scheduled with special protocol arrangements in place',
            source: 'shriguru'
        });
    }

    // Special poojas
    if (query.includes('pooja') || query.includes('ritual')) {
        items.push({
            time: '10:30 AM',
            description: 'Special Pooja for VIP Visit',
            source: 'shriguru'
        });
    }

    return items;
}

/**
 * Get Temple master calendar events
 */
function getTempleCalendarEvents(date: Date, query: string): CalendarItem[] {
    const items: CalendarItem[] = [];

    // Sahasra Chandi Yaga (if relevant)
    if (query.includes('yaga') || query.includes('ritual') || !query.includes('vip')) {
        items.push({
            time: '09:00 AM',
            description: 'The Sahasra Chandi Yaga Purnahuti will be conducted in the temple sanctum',
            source: 'temple'
        });
    }

    // Daily rituals
    items.push({
        time: '06:00 AM',
        description: 'Morning Aarti at Sharada Temple',
        source: 'temple'
    });

    // Festivals/events
    if (query.includes('festival') || query.includes('event')) {
        items.push({
            time: '12:00 PM',
            description: 'Special Festival Observance',
            source: 'temple'
        });
    }

    return items;
}

/**
 * Get Ekadashi-specific schedule
 */
function getEkadashiSchedule(date: Date): CalendarItem[] {
    const items: CalendarItem[] = [];

    // Ekadashi special schedule
    items.push({
        time: '05:00 AM',
        description: 'Early Morning Pooja and Abhishekam on Ekadashi',
        source: 'temple'
    });

    items.push({
        time: '08:00 AM',
        description: 'Special Ekadashi Vrata Observance and Pooja',
        source: 'temple'
    });

    items.push({
        time: '11:00 AM',
        description: 'Ekadashi Parayanam and Special Darshan',
        source: 'temple'
    });

    items.push({
        time: '06:00 PM',
        description: 'Evening Aarti with Ekadashi Special Observances',
        source: 'temple'
    });

    return items;
}

/**
 * Parse time string to number for sorting (HH:MM AM/PM or HH:MMAM/PM)
 */
function parseTime(timeStr: string): number {
    // Handle formats like "9:00 PM", "9PM", "09:00 PM", etc.
    let time = timeStr.trim();
    let period = '';
    
    // Extract AM/PM
    if (time.endsWith('AM') || time.endsWith('PM')) {
        period = time.slice(-2);
        time = time.slice(0, -2).trim();
    } else if (time.includes(' ')) {
        const parts = time.split(' ');
        time = parts[0];
        period = parts[1] || '';
    }
    
    // Parse hours and minutes
    let hour = 0;
    let min = 0;
    
    if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        hour = parseInt(hours);
        min = parseInt(minutes) || 0;
    } else {
        // Handle "9PM" format
        hour = parseInt(time);
        min = 0;
    }

    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
    }

    return hour * 60 + min;
}

