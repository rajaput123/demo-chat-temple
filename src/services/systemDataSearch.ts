/**
 * System Data Search Service
 * 
 * Searches existing mock data to find matches for user queries
 */

import { getAllSystemRecords, SystemRecord } from './systemDataRegistry';

export interface SearchResult {
    record: SystemRecord | null;
    confidence: number;
    matchType: 'exact' | 'partial' | 'fuzzy' | 'none';
    matchedFields: string[];
}

/**
 * Search system data for matching records
 */
export function searchSystemData(query: string): SearchResult {
    const lowercaseQuery = query.toLowerCase();
    const allRecords = getAllSystemRecords();
    
    // Extract potential search terms
    const searchTerms = extractSearchTerms(lowercaseQuery);
    
    let bestMatch: SystemRecord | null = null;
    let bestConfidence = 0;
    let bestMatchType: 'exact' | 'partial' | 'fuzzy' | 'none' = 'none';
    let bestMatchedFields: string[] = [];

    // Search through all records
    for (const record of allRecords) {
        const matchResult = matchRecord(record, searchTerms, lowercaseQuery);
        
        if (matchResult.confidence > bestConfidence) {
            bestMatch = record;
            bestConfidence = matchResult.confidence;
            bestMatchType = matchResult.matchType;
            bestMatchedFields = matchResult.matchedFields;
        }
    }

    // If confidence is too low, return null (will show "New" status)
    if (bestConfidence < 0.3) {
        return {
            record: null,
            confidence: 0,
            matchType: 'none',
            matchedFields: [],
        };
    }

    return {
        record: bestMatch,
        confidence: bestConfidence,
        matchType: bestMatchType,
        matchedFields: bestMatchedFields,
    };
}

/**
 * Extract search terms from query
 */
function extractSearchTerms(query: string): {
    names: string[];
    dates: string[];
    times: string[];
    locations: string[];
    keywords: string[];
} {
    const names: string[] = [];
    const dates: string[] = [];
    const times: string[] = [];
    const locations: string[] = [];
    const keywords: string[] = [];

    // Extract dates (tomorrow, today, specific dates)
    if (query.includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dates.push(tomorrow.toISOString().split('T')[0]);
    }
    if (query.includes('today')) {
        dates.push(new Date().toISOString().split('T')[0]);
    }

    // Extract times (AM/PM patterns)
    const timePattern = /\d{1,2}\s*(am|pm|AM|PM)/gi;
    const timeMatches = query.match(timePattern);
    if (timeMatches) {
        times.push(...timeMatches);
    }

    // Extract locations (common temple locations)
    const locationKeywords = ['sringeri', 'temple', 'sharada', 'main', 'hall', 'vault'];
    locationKeywords.forEach(loc => {
        if (query.includes(loc)) {
            locations.push(loc);
        }
    });

    // Extract names (capitalized words, common names)
    const words = query.split(/\s+/);
    words.forEach(word => {
        if (word.length > 2 && /^[A-Z]/.test(word)) {
            names.push(word.toLowerCase());
        }
    });

    // Extract keywords
    const keywordPatterns = [
        'visit', 'visiting', 'visitor',
        'meeting', 'appointment',
        'ritual', 'aarti', 'puja',
        'donation', 'expense',
        'task', 'project',
        'employee', 'priest', 'volunteer',
        'vip', 'minister', 'prime minister',
    ];
    
    keywordPatterns.forEach(keyword => {
        if (query.includes(keyword)) {
            keywords.push(keyword);
        }
    });

    return { names, dates, times, locations, keywords };
}

/**
 * Match a record against search terms
 */
function matchRecord(
    record: SystemRecord,
    searchTerms: ReturnType<typeof extractSearchTerms>,
    fullQuery: string
): {
    confidence: number;
    matchType: 'exact' | 'partial' | 'fuzzy' | 'none';
    matchedFields: string[];
} {
    let confidence = 0;
    const matchedFields: string[] = [];
    let matchType: 'exact' | 'partial' | 'fuzzy' | 'none' = 'none';

    // Name matching
    const recordName = (record.name || record.title || '').toLowerCase();
    searchTerms.names.forEach(name => {
        if (recordName.includes(name) || name.includes(recordName)) {
            confidence += 0.4;
            matchedFields.push('name');
            matchType = recordName === name ? 'exact' : 'partial';
        }
    });

    // Date matching
    if (record.date && searchTerms.dates.length > 0) {
        searchTerms.dates.forEach(date => {
            if (record.date === date) {
                confidence += 0.3;
                matchedFields.push('date');
                matchType = matchType === 'none' ? 'exact' : matchType;
            }
        });
    }

    // Time matching
    if (record.time && searchTerms.times.length > 0) {
        searchTerms.times.forEach(time => {
            const recordTime = record.time?.toLowerCase() || '';
            if (recordTime.includes(time.toLowerCase()) || time.toLowerCase().includes(recordTime)) {
                confidence += 0.2;
                matchedFields.push('time');
                matchType = matchType === 'none' ? 'partial' : matchType;
            }
        });
    }

    // Location matching
    if (record.location) {
        const recordLocation = record.location.toLowerCase();
        searchTerms.locations.forEach(loc => {
            if (recordLocation.includes(loc)) {
                confidence += 0.2;
                matchedFields.push('location');
                matchType = matchType === 'none' ? 'partial' : matchType;
            }
        });
    }

    // Type/keyword matching
    searchTerms.keywords.forEach(keyword => {
        if (record.type?.includes(keyword) || fullQuery.includes(record.type || '')) {
            confidence += 0.15;
            matchedFields.push('type');
            matchType = matchType === 'none' ? 'fuzzy' : matchType;
        }
    });

    // Status matching
    if (record.status) {
        const statusKeywords = ['pending', 'scheduled', 'completed', 'active', 'inactive'];
        statusKeywords.forEach(status => {
            if (fullQuery.includes(status) && record.status?.toLowerCase().includes(status)) {
                confidence += 0.1;
                matchedFields.push('status');
            }
        });
    }

    return {
        confidence: Math.min(confidence, 1.0),
        matchType: matchType === 'none' ? 'fuzzy' : matchType,
        matchedFields: [...new Set(matchedFields)],
    };
}

/**
 * Format search result for InfoCard display
 */
export function formatSearchResultForInfoCard(result: SearchResult): {
    recordType: string;
    status: string;
    date?: string;
    time?: string;
    location?: string;
    assignedRoles?: string;
    missingInformation?: string[];
    conflicts?: string[];
} {
    if (!result.record) {
        return {
            recordType: 'New / Unregistered',
            status: 'Not yet created',
        };
    }

    const record = result.record;
    const info: any = {
        recordType: record.type || 'Unknown',
        status: record.status || 'Unknown',
    };

    if (record.date) info.date = record.date;
    if (record.time) info.time = record.time;
    if (record.location) info.location = record.location;
    if (record.assignedTo) info.assignedRoles = record.assignedTo;
    if (record.name) info.name = record.name;
    if (record.title) info.title = record.title;

    // Determine missing information based on record type
    const missingInfo: string[] = [];
    if (record.type === 'activity' && !record.time) missingInfo.push('Time not specified');
    if (record.type === 'task' && !record.assignedTo) missingInfo.push('No assignee');
    if (record.type === 'seva-booking' && !record.time) missingInfo.push('Time slot needed');
    if (missingInfo.length > 0) {
        info.missingInformation = missingInfo;
    }

    return info;
}

