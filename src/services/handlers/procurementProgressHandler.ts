/**
 * Procurement Progress Handler
 * Handles queries about sugarcane procurement progress against season targets
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { createSection, createPlannerSection } from '@/services/sectionManager';

export interface ProcurementProgressResult {
    handled: boolean;
    response?: string;
    sections?: CanvasSection[];
    needsAsyncProcessing?: boolean;
}

/**
 * Check if query is about procurement progress
 */
function isProcurementProgressQuery(query: string): boolean {
    const lowercaseQuery = query.toLowerCase();
    // Check for procurement-related keywords
    const hasProcurement = lowercaseQuery.includes('procurement');
    const hasSeason = lowercaseQuery.includes('season');
    const hasTarget = lowercaseQuery.includes('target');
    const hasProgress = lowercaseQuery.includes('progress');
    const hasRisk = lowercaseQuery.includes('risk');
    
    // Match if query contains procurement + (season/target/progress/risk)
    return hasProcurement && (hasSeason || hasTarget || hasProgress || hasRisk);
}

/**
 * Generate procurement data based on risk level
 */
function generateProcurementData(): {
    seasonTarget: string;
    procuredPercentage: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    procuredTons: number;
    targetTons: number;
} {
    // Randomize to show different scenarios
    const riskLevels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    let procuredPercentage: number;
    let targetTons: number;
    
    switch (riskLevel) {
        case 'Low':
            procuredPercentage = Math.floor(Math.random() * 11) + 75; // 75-85%
            targetTons = Math.floor(Math.random() * 25000) + 50000; // 50,000-75,000 tons
            break;
        case 'Medium':
            procuredPercentage = Math.floor(Math.random() * 15) + 60; // 60-74%
            targetTons = Math.floor(Math.random() * 25000) + 50000; // 50,000-75,000 tons
            break;
        case 'High':
            procuredPercentage = Math.floor(Math.random() * 15) + 45; // 45-59%
            targetTons = Math.floor(Math.random() * 25000) + 50000; // 50,000-75,000 tons
            break;
    }
    
    const procuredTons = Math.floor((targetTons * procuredPercentage) / 100);
    
    return {
        seasonTarget: `${targetTons.toLocaleString()} tons`,
        procuredPercentage: `${procuredPercentage}%`,
        riskLevel,
        procuredTons,
        targetTons
    };
}

/**
 * Generate planner actions based on risk level and procurement status
 */
function generatePlannerActions(
    riskLevel: 'Low' | 'Medium' | 'High',
    procuredPercentage: number,
    targetTons: number,
    procuredTons: number
): string {
    const actions: string[] = [];
    const shortfall = targetTons - procuredTons;
    const shortfallPercentage = 100 - procuredPercentage;
    
    // Immediate Actions (Today) - 2-3 actions
    actions.push('[·] Review current supplier delivery schedules and confirm next batch arrivals');
    actions.push('[·] Verify storage capacity availability for incoming cane deliveries');
    
    if (riskLevel === 'High' || shortfallPercentage > 30) {
        actions.push('[·] Escalate procurement shortfall status to factory management');
    } else {
        actions.push('[·] Coordinate with quality control team on incoming cane inspection protocols');
    }
    
    // Short-Term Actions (Next 3 Days) - 3-4 actions
    actions.push('[·] Contact alternate suppliers to secure additional cane quantities');
    actions.push('[·] Assess logistics capacity for increased procurement volume');
    actions.push('[·] Review payment terms with existing suppliers to expedite deliveries');
    
    if (riskLevel === 'Medium' || riskLevel === 'High') {
        actions.push('[·] Schedule emergency procurement meeting with procurement team');
    } else {
        actions.push('[·] Update procurement forecast based on current delivery trends');
    }
    
    // Risk Mitigation & Control - 2-3 actions
    if (riskLevel === 'High') {
        actions.push('[·] Activate contingency procurement plan and engage backup suppliers');
        actions.push('[·] Implement daily procurement tracking dashboard for management review');
        actions.push('[·] Coordinate with finance team to release advance payments for priority suppliers');
    } else if (riskLevel === 'Medium') {
        actions.push('[·] Increase monitoring frequency of supplier delivery commitments');
        actions.push('[·] Prepare risk mitigation report for management review');
    } else {
        actions.push('[·] Maintain current procurement pace and monitor for any delivery delays');
        actions.push('[·] Review supplier performance metrics and identify optimization opportunities');
    }
    
    return actions.join('\n');
}

/**
 * Handle procurement progress queries
 */
export function handleProcurementProgress(query: string): ProcurementProgressResult {
    if (!isProcurementProgressQuery(query)) {
        return { handled: false };
    }
    
    // Generate procurement data
    const procurementData = generateProcurementData();
    
    // Calculate remaining target
    const remainingTons = procurementData.targetTons - procurementData.procuredTons;
    const remainingPercentage = 100 - parseInt(procurementData.procuredPercentage);
    
    // Create info card content as list format with sentences (2 information points)
    const infoCardContent = `Season procurement target: ${procurementData.seasonTarget}\nProcured till date: ${procurementData.procuredPercentage}\nOverall procurement risk level: ${procurementData.riskLevel}\nRemaining procurement required: ${remainingTons.toLocaleString()} tons (${remainingPercentage}%)`;
    
    // Generate planner actions
    const plannerActions = generatePlannerActions(
        procurementData.riskLevel,
        parseInt(procurementData.procuredPercentage),
        procurementData.targetTons,
        procurementData.procuredTons
    );
    
    // Create sections
    const sections: CanvasSection[] = [
        createSection(
            `focus-procurement-${Date.now()}`,
            'Procurement Progress',
            infoCardContent,
            'list'
        ),
        createPlannerSection(
            plannerActions,
            'Procurement Action Plan',
            `planner-procurement-${Date.now()}`
        )
    ];
    
    // Minimal one-line response message for chat
    const response = 'Procurement progress summary displayed.';
    
    return {
        handled: true,
        response,
        sections,
        needsAsyncProcessing: true
    };
}

