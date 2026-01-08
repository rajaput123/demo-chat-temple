/**
 * Module Detection Handler
 * Handles queries that trigger module switching
 */

import { ModuleDetector, ModuleName } from '@/services/moduleDetector';

export interface ModuleDetectionResult {
    handled: boolean;
    module?: ModuleName;
    message?: string;
}

/**
 * Handle module detection from query
 */
export function handleModuleDetection(query: string): ModuleDetectionResult {
    const detectedModule = ModuleDetector.detectModule(query);
    
    if (!detectedModule) {
        return { handled: false };
    }

    // Show sub-modules in chat for Assets module
    if (detectedModule === 'Assets') {
        const assetsSubModules = [
            'Asset Registry',
            'Classification & Tagging',
            'Onboarding & Acquisition',
            'Security & Custody',
            'Movement tracking',
            'Maintenance & Preservation',
            'Audit & Verification',
            'Valuation & Finance',
            'Compliance & Legal',
            'Retirement & Disposal',
            'History & Memory',
            'Impact & Reporting',
            'Access & Governance'
        ];
        
        const message = `Switching to ${detectedModule} module.\n\nAvailable sub-modules:\n${assetsSubModules.map((sub, idx) => `${idx + 1}. ${sub}`).join('\n')}`;
        
        return {
            handled: true,
            module: detectedModule,
            message
        };
    } else {
        return {
            handled: true,
            module: detectedModule,
            message: `Switching to ${detectedModule} module...`
        };
    }
}

