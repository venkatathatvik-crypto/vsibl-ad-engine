import { PricingVersionConfig, CampaignInput } from './pricing.types';

export class PricingValidator {
    static validateConfig(config: PricingVersionConfig): string[] {
        const errors: string[] = [];

        if (config.basePrice <= 0) {
            errors.push('Base price must be greater than 0');
        }

        if (!config.factors || config.factors.length === 0) {
            errors.push('At least one pricing factor must be defined');
        }

        config.factors.forEach((f, idx) => {
            if (f.priority < 1 || f.priority > 10) {
                errors.push(`Factor "${f.name}" has invalid priority ${f.priority}. Must be 1-10.`);
            }
            if (f.value < 0 && f.type === 'MULTIPLIER') {
                errors.push(`Factor "${f.name}" cannot have a negative multiplier.`);
            }
        });

        // Overlapping time slots check
        // (Omitted for brevity, but recommended in production)

        return errors;
    }

    static validateCampaignInput(input: CampaignInput): string[] {
        const errors: string[] = [];

        if (input.screenCount < 1) {
            errors.push('Screen count must be at least 1');
        }
        if (input.totalDays < 1) {
            errors.push('Duration must be at least 1 day');
        }
        if (input.impressionsPerDay < 1) {
            errors.push('Impressions per day must be at least 1');
        }

        return errors;
    }
}
