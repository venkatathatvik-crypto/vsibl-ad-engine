import { create } from 'zustand';

interface PricingFactor {
    id: string;
    name: string;
    key: string;
    enabled: boolean;
    priority: number;
    type: 'MULTIPLIER' | 'ADDITIVE';
    value: number;
}

interface TimeSlot {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    multiplier: number;
    priority: number;
}

interface PricingConfig {
    id: string;
    versionNumber: number;
    basePrice: number;
    tokenUsdPrice: number;
    factors: PricingFactor[];
    timeSlots: TimeSlot[];
}

interface PricingStore {
    activeConfig: PricingConfig | null;
    loading: boolean;
    error: string | null;
    fetchConfig: () => Promise<void>;
    calculatePrice: (input: any) => Promise<any>;
}

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

export const usePricingStore = create<PricingStore>((set) => ({
    activeConfig: null,
    loading: false,
    error: null,
    fetchConfig: async () => {
        const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
        if (isDemoMode) {
            set({ loading: true, error: null });
            const mockConfig: PricingConfig = {
                id: 'mock-config-id',
                versionNumber: 1,
                basePrice: 10,
                tokenUsdPrice: 0.04,
                factors: [
                    { id: 'f1', name: 'Format (IMAGE)', key: 'FORMAT_IMAGE', enabled: true, priority: 1, type: 'MULTIPLIER', value: 1.0 },
                    { id: 'f2', name: 'Format (VIDEO)', key: 'FORMAT_VIDEO', enabled: true, priority: 2, type: 'MULTIPLIER', value: 1.5 },
                    { id: 'f3', name: 'Priority (HIGH)', key: 'PRIORITY_HIGH', enabled: true, priority: 3, type: 'MULTIPLIER', value: 1.8 },
                ],
                timeSlots: [
                    { id: 't1', name: 'Morning Peak', startTime: '08:00', endTime: '11:00', multiplier: 1.5, priority: 1 },
                    { id: 't2', name: 'Evening Peak', startTime: '17:00', endTime: '21:00', multiplier: 1.8, priority: 2 },
                ]
            };
            set({ activeConfig: mockConfig, loading: false });
            return;
        }

        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/pricing/config`);

            if (!response.ok) {
                let errorMsg = 'Failed to fetch pricing configuration';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (e) {
                    // Not JSON, use generic error or status text
                    errorMsg = response.statusText || errorMsg;
                }
                set({ error: errorMsg, loading: false });
                return;
            }

            const data = await response.json();
            set({ activeConfig: data, loading: false });
        } catch (err: any) {
            set({ error: err.message || 'Network error occurred', loading: false });
        }
    },
    calculatePrice: async (input) => {
        const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
        if (isDemoMode) {
            const base = 10;
            const formatMultiplier = input.adFormat === 'VIDEO' || input.adFormat === 'MP4' ? 1.5 : 1.0;
            const priorityMultiplier = input.slotPriority === 'HIGH' ? 1.5 : input.slotPriority === 'PREMIUM' ? 2.0 : 1.0;
            const days = input.totalDays || 7;
            const screens = input.screenCount || 1;
            const impressions = input.impressionsPerDay || 1000;
            
            const totalTokens = Math.round(base * formatMultiplier * priorityMultiplier * days * screens * (impressions / 1000));
            const totalUsd = totalTokens * 0.04;
            
            return {
                finalPrice: totalTokens,
                usd: totalUsd,
                breakdown: [
                    { factor: 'Base Rate / Day', change: base * days },
                    { factor: `Format Adjuster (${input.adFormat})`, change: (formatMultiplier - 1.0) * base * days },
                    { factor: `Priority Adjuster (${input.slotPriority})`, change: (priorityMultiplier - 1.0) * base * days },
                    { factor: `Impressions multiplier`, change: (impressions / 1000) },
                    { factor: `Screen Quantity (${screens} displays)`, change: screens }
                ]
            };
        }

        try {
            const response = await fetch(`${API_URL}/pricing/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });
            if (!response.ok) throw new Error('Failed to calculate price');
            return await response.json();
        } catch (err: any) {
            console.error(err);
            return null;
        }
    },
}));
