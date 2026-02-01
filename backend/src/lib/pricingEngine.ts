// Pure TypeScript pricing engine for VSIBL
// Consumes a PricingVersion-like config + input and returns a deterministic breakdown.

export type AdFormat = "image" | "gif" | "mp4" | "webm";

export type FactorKey = "screen_count" | "time_slot" | "format" | "duration";

export interface ScreenSlab {
  min: number;
  max?: number | null;
  multiplier: number;
}

export interface TimeSlotRule {
  id: string; // stable identifier
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  multiplier: number;
}

export interface FormatMultiplier {
  format: AdFormat;
  multiplier: number;
}

export interface DurationSlab {
  minSeconds: number;
  maxSeconds?: number | null;
  multiplier: number;
}

export interface FactorPriority {
  factor: FactorKey;
  priority: number; // 1–10, higher means applied later
}

export interface PricingConfig {
  basePrice: number;
  screenSlabs: ScreenSlab[];
  timeSlots: TimeSlotRule[];
  formatMultipliers: FormatMultiplier[];
  durationSlabs: DurationSlab[];
  factorPriorities: FactorPriority[];
}

export interface PricingInput {
  screenCount: number;
  timeSlotId: string;
  format: AdFormat;
  dailyPlaySeconds: number;
}

export interface PricingBreakdown {
  basePrice: number;
  appliedMultipliers: {
    screen_count: number;
    time_slot: number;
    format: number;
    duration: number;
    order: FactorKey[];
  };
  finalTokenCost: number;
}

export function computePricing(config: PricingConfig, input: PricingInput): PricingBreakdown {
  const { basePrice, screenSlabs, timeSlots, formatMultipliers, durationSlabs, factorPriorities } =
    config;

  const getScreenMultiplier = (): number => {
    const slab = screenSlabs.find((s) =>
      s.max != null ? input.screenCount >= s.min && input.screenCount <= s.max : input.screenCount >= s.min
    );
    return slab?.multiplier ?? 1;
  };

  const getTimeSlotMultiplier = (): number => {
    const slot = timeSlots.find((t) => t.id === input.timeSlotId);
    return slot?.multiplier ?? 1;
  };

  const getFormatMultiplier = (): number => {
    const fm = formatMultipliers.find((f) => f.format === input.format);
    return fm?.multiplier ?? 1;
  };

  const getDurationMultiplier = (): number => {
    const slab = durationSlabs.find((d) =>
      d.maxSeconds != null
        ? input.dailyPlaySeconds >= d.minSeconds && input.dailyPlaySeconds <= d.maxSeconds
        : input.dailyPlaySeconds >= d.minSeconds
    );
    return slab?.multiplier ?? 1;
  };

  const multipliersMap: Record<FactorKey, number> = {
    screen_count: getScreenMultiplier(),
    time_slot: getTimeSlotMultiplier(),
    format: getFormatMultiplier(),
    duration: getDurationMultiplier(),
  };

  const orderedFactors: FactorKey[] = [...factorPriorities]
    .sort((a, b) => a.priority - b.priority)
    .map((f) => f.factor);

  let cost = basePrice;
  for (const factor of orderedFactors) {
    const m = multipliersMap[factor];
    cost *= m;
  }

  return {
    basePrice,
    appliedMultipliers: {
      screen_count: multipliersMap.screen_count,
      time_slot: multipliersMap.time_slot,
      format: multipliersMap.format,
      duration: multipliersMap.duration,
      order: orderedFactors,
    },
    finalTokenCost: Math.round(cost),
  };
}
