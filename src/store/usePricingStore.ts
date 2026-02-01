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
