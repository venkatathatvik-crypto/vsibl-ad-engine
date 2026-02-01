export type PricingFactorType = 'MULTIPLIER' | 'ADDITIVE';

export interface PricingFactorConfig {
    id: string;
    name: string;
    key: string;
    enabled: boolean;
    priority: number;
    type: PricingFactorType;
    value: number;
    config?: any;
}

export interface TimeSlotConfig {
    id: string;
    name: string;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    multiplier: number;
    priority: number;
}

export interface PricingVersionConfig {
    id: string;
    versionNumber: number;
    basePrice: number;
    tokenUsdPrice?: number;
    factors: PricingFactorConfig[];
    timeSlots: TimeSlotConfig[];
}

export interface CampaignInput {
    screenCount: number;
    impressionsPerDay: number;
    totalDays: number;
    slotPriority: 'NORMAL' | 'HIGH' | 'PREMIUM';
    adFormat: 'IMAGE' | 'GIF' | 'MP4' | 'WEBM';
    timeSlots: string[]; // IDs of selected time slots
}

export interface PricingBreakdownStep {
    factor: string;
    priority: number;
    type: PricingFactorType | 'BASE' | 'TIME_SLOT';
    preValue: number;
    change: number;
    postValue: number;
}

export interface PricingResult {
    basePrice: number;
    finalPrice: number;
    breakdown: PricingBreakdownStep[];
    pricingVersionId: string;
}
