/**
 * Quick Action Handler Service
 * 
 * Handles "Show" queries (alerts, appointments, approvals, finance, cane intake, production batch)
 * that replace the default info card with relevant component views.
 */

import { CanvasSection } from '@/hooks/useSimulation';

export interface QuickActionResult {
    sectionId: string;
    sectionTitle: string;
    responseMessage: string;
    sections?: CanvasSection[]; // Info card data
}

export class QuickActionHandler {
    /**
     * Main entry point - handles quick action queries
     */
    static handleQuery(query: string): QuickActionResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a quick action query (Show, View, List, Check)
        const isQuickAction = lowercaseQuery.startsWith('show') || 
                             lowercaseQuery.includes('view') || 
                             lowercaseQuery.includes('list') ||
                             lowercaseQuery.includes('check');
        
        if (!isQuickAction) return null;

        // Date detection
        const isFuture = lowercaseQuery.includes('tomorrow') ||
                        lowercaseQuery.includes('next week') ||
                        lowercaseQuery.includes('future') ||
                        lowercaseQuery.includes('upcoming');
        const datePrefix = isFuture ? 'Tomorrow\'s' : 'Today\'s';

        // Handle cane intake status
        if (lowercaseQuery.includes('cane') && (lowercaseQuery.includes('intake') || lowercaseQuery.includes('status'))) {
            const caneIntakeData = {
                title: 'Cane Intake Status',
                subTitle: 'Current Status: Active | Today\'s Intake: 450 tons',
                highlightTitle: "INTAKE | HIGHLIGHTS",
                highlights: [
                    { time: '06:00 AM', description: 'Morning intake started. 5 trucks arrived.' },
                    { time: '10:00 AM', description: 'Peak intake period. 15 trucks in queue.' },
                    { time: '02:00 PM', description: 'Afternoon intake. 8 trucks processed.' },
                    { time: '06:00 PM', description: 'Evening intake complete. Total: 450 tons.' }
                ]
            };
            return {
                sectionId: 'focus-cane-intake',
                sectionTitle: 'Cane Intake Status',
                responseMessage: 'Showing current cane intake status.',
                sections: [{
                    id: 'focus-cane-intake',
                    title: 'Cane Intake Status',
                    content: JSON.stringify(caneIntakeData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                }]
            };
        }

        // Handle production batch
        if (lowercaseQuery.includes('production') && lowercaseQuery.includes('batch')) {
            const batchData = {
                title: 'Production Batch Status',
                subTitle: 'Current Batch: #B-2024-045 | Status: Processing',
                highlightTitle: "BATCH | HIGHLIGHTS",
                highlights: [
                    { time: '07:00 AM', description: 'Batch started. Crushing unit operational.' },
                    { time: '09:00 AM', description: 'Quality check completed. All parameters normal.' },
                    { time: '12:00 PM', description: 'Mid-batch review. Production on track.' },
                    { time: '04:00 PM', description: 'Batch completion expected at 6:00 PM.' }
                ]
            };
            return {
                sectionId: 'focus-production-batch',
                sectionTitle: 'Production Batch Status',
                responseMessage: 'Showing current production batch status.',
                sections: [{
                    id: 'focus-production-batch',
                    title: 'Production Batch Status',
                    content: JSON.stringify(batchData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                }]
            };
        }

        // Handle quality reports
        if (lowercaseQuery.includes('quality') && (lowercaseQuery.includes('report') || lowercaseQuery.includes('reports'))) {
            const qualityData = {
                title: 'Quality Control Reports',
                subTitle: 'Last Updated: Today 2:00 PM | Status: All Clear',
                highlightTitle: "QUALITY | HIGHLIGHTS",
                highlights: [
                    { time: '08:00 AM', description: 'Morning quality check: Passed' },
                    { time: '12:00 PM', description: 'Midday quality check: Passed' },
                    { time: '02:00 PM', description: 'Afternoon quality check: Passed' },
                    { time: '06:00 PM', description: 'Evening quality check: Pending' }
                ]
            };
            return {
                sectionId: 'focus-quality',
                sectionTitle: 'Quality Control Reports',
                responseMessage: 'Showing quality control reports.',
                sections: [{
                    id: 'focus-quality',
                    title: 'Quality Control Reports',
                    content: JSON.stringify(qualityData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                }]
            };
        }

        // Handle supplier/inspection visits (check before appointments to avoid conflicts)
        if (lowercaseQuery.includes('supplier') && (lowercaseQuery.includes('visit') || lowercaseQuery.includes('visits'))) {
            const supplierData = {
                title: 'Supplier Visits',
                subTitle: `${datePrefix} Schedule | Total: 3 visits`,
                highlightTitle: "VISITS | HIGHLIGHTS",
                highlights: [
                    { time: '09:00 AM', description: 'Supplier A - Cane delivery inspection' },
                    { time: '11:00 AM', description: 'Supplier B - Quality audit' },
                    { time: '03:00 PM', description: 'Supplier C - Contract review' }
                ]
            };
            return {
                sectionId: 'focus-supplier',
                sectionTitle: `${datePrefix} Supplier Visits`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} supplier visits.`,
                sections: [{
                    id: 'focus-supplier',
                    title: `${datePrefix} Supplier Visits`,
                    content: JSON.stringify(supplierData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                }]
            };
        }

        // Handle appointments/calendar/schedule (explicit "Show appointments" support)
        if (lowercaseQuery.includes('appointment') || lowercaseQuery.includes('calendar') || lowercaseQuery.includes('schedule')) {
            return {
                sectionId: 'focus-appointments',
                sectionTitle: `${datePrefix} Appointments`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} appointments and schedule.`
            };
        }

        // Handle approvals
        if (lowercaseQuery.includes('approval')) {
            const approvalData = {
                title: 'Pending Approvals',
                subTitle: `${datePrefix} | Total: 3 pending`,
                highlightTitle: "APPROVALS | HIGHLIGHTS",
                highlights: [
                    { time: 'Equipment Purchase', description: '₹5,00,000 - High Priority' },
                    { time: 'Maintenance Request', description: 'Crushing Unit - Medium Priority' },
                    { time: 'Supplier Contract', description: 'Supplier A - Low Priority' }
                ]
            };
            return {
                sectionId: 'focus-approvals',
                sectionTitle: `${datePrefix} Approvals`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} pending approvals.`,
                sections: [{
                    id: 'focus-approvals',
                    title: `${datePrefix} Approvals`,
                    content: JSON.stringify(approvalData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                }]
            };
        }

        // Handle alerts/reminders/notifications
        if (lowercaseQuery.includes('alert') || lowercaseQuery.includes('reminder') || lowercaseQuery.includes('notification')) {
            const alertData = {
                title: 'Alerts & Reminders',
                subTitle: `${datePrefix} | Total: 4 alerts`,
                highlightTitle: "ALERTS | HIGHLIGHTS",
                highlights: [
                    { time: '08:00 AM', description: 'Quality check due in 1 hour' },
                    { time: '12:00 PM', description: 'Production batch review meeting' },
                    { time: '03:00 PM', description: 'Supplier visit scheduled' },
                    { time: '05:00 PM', description: 'Daily report submission' }
                ]
            };
            return {
                sectionId: 'focus-alert',
                sectionTitle: `${datePrefix} Alerts`,
                responseMessage: `Showing ${datePrefix.toLowerCase()} alerts and reminders.`,
                sections: [{
                    id: 'focus-alert',
                    title: `${datePrefix} Alerts`,
                    content: JSON.stringify(alertData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                }]
            };
        }

        // Handle finance/summary/collection/payment/revenue
        if (lowercaseQuery.includes('finance') || 
            lowercaseQuery.includes('summary') || 
            lowercaseQuery.includes('collection') || 
            lowercaseQuery.includes('payment') || 
            lowercaseQuery.includes('revenue')) {
            
            // Check if it's an actionable finance query
            const isActionable = lowercaseQuery.includes('approve') || 
                               lowercaseQuery.includes('pay') || 
                               lowercaseQuery.includes('transfer') || 
                               lowercaseQuery.includes('create');
            
            if (isActionable) {
                const financeData = {
                    title: 'Finance Action Required',
                    subTitle: 'Pending Approval | Amount: ₹2,50,000',
                    highlightTitle: "FINANCE | HIGHLIGHTS",
                    highlights: [
                        { time: 'Status', description: 'Payment approval pending' },
                        { time: 'Amount', description: '₹2,50,000' },
                        { time: 'Department', description: 'Production' },
                        { time: 'Priority', description: 'High' }
                    ]
                };
                return {
                    sectionId: 'focus-finance',
                    sectionTitle: 'Finance Action',
                    responseMessage: 'Processing your finance request...',
                    sections: [{
                        id: 'focus-finance',
                        title: 'Finance Action Required',
                        content: JSON.stringify(financeData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }]
                };
            } else {
                const financeData = {
                    title: 'Financial Summary',
                    subTitle: `${datePrefix} Overview | Revenue: ₹15,00,000`,
                    highlightTitle: "FINANCE | HIGHLIGHTS",
                    highlights: [
                        { time: 'Revenue', description: '₹15,00,000' },
                        { time: 'Expenses', description: '₹8,50,000' },
                        { time: 'Profit', description: '₹6,50,000' },
                        { time: 'Status', description: 'On track' }
                    ]
                };
                return {
                    sectionId: 'focus-finance',
                    sectionTitle: `${datePrefix} Finance Summary`,
                    responseMessage: `Showing ${datePrefix.toLowerCase()} financial summary.`,
                    sections: [{
                        id: 'focus-finance',
                        title: `${datePrefix} Finance Summary`,
                        content: JSON.stringify(financeData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }]
                };
            }
        }

        return null;
    }
}

