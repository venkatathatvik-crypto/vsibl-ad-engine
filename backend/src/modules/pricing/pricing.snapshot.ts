import { PrismaClient } from '../../../prisma/generated/client';
import { PricingResult, PricingVersionConfig } from './pricing.types';

export class PricingSnapshotManager {
    constructor(private prisma: PrismaClient) { }

    async getCurrentConfig(): Promise<PricingVersionConfig | null> {
        const activeConfig = await this.prisma.pricingConfig.findFirst({
            include: {
                activeVersion: {
                    include: {
                        factors: true,
                        timeSlots: true
                    }
                }
            }
        });

        if (!activeConfig || !activeConfig.activeVersion) {
            return null;
        }

        const version = activeConfig.activeVersion;

        return {
            id: version.id,
            version: version.version,
            basePrice: Number(version.basePrice),
            tokenUsdPrice: Number(version.tokenUsdPrice),
            factors: version.factors.map(f => ({
                id: f.id,
                name: f.name,
                key: f.key,
                enabled: f.enabled,
                priority: f.priority,
                type: f.type as any,
                value: Number(f.value),
                config: f.config
            })),
            timeSlots: version.timeSlots.map(ts => ({
                id: ts.id,
                name: ts.name,
                startTime: ts.startTime,
                endTime: ts.endTime,
                multiplier: Number(ts.multiplier),
                priority: ts.priority
            }))
        };
    }

    async saveSnapshot(campaignId: string, result: PricingResult) {
        return await this.prisma.campaignPricingSnapshot.create({
            data: {
                campaignId,
                pricingVersionId: result.pricingVersionId,
                basePrice: result.basePrice,
                finalPrice: result.finalPrice,
                breakdown: JSON.parse(JSON.stringify(result.breakdown)) // Ensure JSON serializable
            }
        });
    }
}
