import {
    PricingVersionConfig,
    CampaignInput,
    PricingResult,
    PricingBreakdownStep,
    PricingFactorConfig
} from './pricing.types';

export class PricingEngine {
    /**
     * Calculates the final price for a campaign based on the provided configuration.
     * This is a pure function.
     */
    static calculate(config: PricingVersionConfig, input: CampaignInput): PricingResult {
        let currentPrice = config.basePrice;
        const breakdown: PricingBreakdownStep[] = [];

        // 0. Base Price Step
        breakdown.push({
            factor: 'Base Price',
            priority: 0,
            type: 'BASE',
            preValue: 0,
            change: config.basePrice,
            postValue: config.basePrice
        });

        // 1. Sort factors by priority (descending order: 10 down to 1)
        const sortedFactors = [...config.factors]
            .filter(f => f.enabled)
            .sort((a, b) => b.priority - a.priority);

        // 2. Apply factors
        for (const factor of sortedFactors) {
            const preValue = currentPrice;
            const factorValue = this.getFactorValueForInput(factor, input);
            let change = 0;

            if (factor.type === 'MULTIPLIER') {
                currentPrice *= factorValue;
                change = currentPrice - preValue;
            } else {
                currentPrice += factorValue;
                change = factorValue;
            }

            breakdown.push({
                factor: factor.name,
                priority: factor.priority,
                type: factor.type,
                preValue,
                change,
                postValue: currentPrice
            });
        }

        // 3. Apply Time Slots (Usually these are multipliers)
        const selectedTimeSlots = config.timeSlots.filter(ts => input.timeSlots.includes(ts.id));

        // Sort time slots by priority
        selectedTimeSlots.sort((a, b) => b.priority - a.priority);

        for (const slot of selectedTimeSlots) {
            const preValue = currentPrice;
            currentPrice *= slot.multiplier;
            const change = currentPrice - preValue;

            breakdown.push({
                factor: `Time Slot: ${slot.name}`,
                priority: slot.priority,
                type: 'TIME_SLOT',
                preValue,
                change,
                postValue: currentPrice
            });
        }

        // 4. Final adjustments for scale (Impressions, Screens, Days)
        // Note: In some models, these are factors themselves. 
        // If not, we multiply the unit price by global scale here.
        const totalScale = input.screenCount * input.totalDays * (input.impressionsPerDay / 100); // e.g. per 100 impressions
        const preScaleValue = currentPrice;
        currentPrice *= totalScale;

        breakdown.push({
            factor: 'Volume Scaling (Screens * Days * Impressions/100)',
            priority: 0,
            type: 'MULTIPLIER',
            preValue: preScaleValue,
            change: currentPrice - preScaleValue,
            postValue: currentPrice
        });

        return {
            basePrice: config.basePrice,
            finalPrice: Math.round(currentPrice * 10000) / 10000, // Round to 4 decimal places
            breakdown,
            pricingVersionId: config.id
        };
    }

    private static getFactorValueForInput(factor: PricingFactorConfig, input: CampaignInput): number {
        // If the factor has a specific config mapping, use it
        if (factor.config && typeof factor.config === 'object') {
            const inputValue = (input as any)[factor.key];
            if (inputValue && factor.config[inputValue] !== undefined) {
                return Number(factor.config[inputValue]);
            }
        }

        // Default: use the static value
        return factor.value;
    }
}
