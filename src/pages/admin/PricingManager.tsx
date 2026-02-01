import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePricingStore } from '@/store/usePricingStore';
import { Plus, Save, Play, Trash2, Settings2, History, Calculator, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

const PricingManager = () => {
    const { activeConfig, fetchConfig, loading, error } = usePricingStore();
    const [localConfig, setLocalConfig] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [simulationInput, setSimulationInput] = useState({
        screenCount: 1,
        impressionsPerDay: 1000,
        totalDays: 7,
        slotPriority: 'NORMAL',
        adFormat: 'IMAGE',
        timeSlots: [] as string[]
    });
    const [simulationResult, setSimulationResult] = useState<any>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    useEffect(() => {
        if (activeConfig) {
            const config = JSON.parse(JSON.stringify(activeConfig));
            if (config.tokenUsdPrice === undefined || config.tokenUsdPrice === null) {
                config.tokenUsdPrice = 0.04;
            }
            setLocalConfig(config);
        }
    }, [activeConfig]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/pricing/manage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localConfig),
            });
            if (!response.ok) throw new Error('Failed to save configuration');
            const newVersion = await response.json();
            toast.success(`Pricing Version ${newVersion.versionNumber} created as DRAFT`);
            fetchConfig();
        } catch (err) {
            toast.error('Error saving configuration');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishLive = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/pricing/manage/publish-now`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localConfig),
            });
            if (!response.ok) throw new Error('Failed to publish live');
            const result = await response.json();
            toast.success(`SUCCESS: Pricing v${result.version.versionNumber} is now LIVE for all clients.`);
            fetchConfig();
        } catch (err) {
            toast.error('Error publishing live changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async (versionId: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/pricing/manage/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ versionId }),
            });
            if (!response.ok) throw new Error('Failed to publish version');
            toast.success('Pricing Version Published & Active');
            fetchConfig();
        } catch (err) {
            toast.error('Error publishing version');
        }
    };

    const runSimulation = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/pricing/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(simulationInput),
        });
        const result = await response.json();
        setSimulationResult(result);
    };

    // Special case: Bootstrap the first config if none exists
    useEffect(() => {
        const isNotFoundError = error?.includes('No active pricing configuration found') ||
            error?.includes('Failed to fetch pricing configuration');

        if (isNotFoundError && !localConfig && !loading) {
            setLocalConfig({
                versionNumber: 0,
                basePrice: 10,
                tokenUsdPrice: 0.04,
                status: 'DRAFT',
                factors: [
                    { id: 'f1', name: 'Priority Multiplier', key: 'slotPriority', enabled: true, priority: 8, type: 'MULTIPLIER', value: 1, config: { NORMAL: 1, HIGH: 2, PREMIUM: 5 } },
                    { id: 'f2', name: 'Format Multiplier', key: 'adFormat', enabled: true, priority: 5, type: 'MULTIPLIER', value: 1, config: { IMAGE: 1, GIF: 1.2, MP4: 2 } }
                ],
                timeSlots: []
            });
        }
    }, [error, localConfig, loading]);

    if (loading && !localConfig) {
        return (
            <DashboardLayout isAdmin>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Syncing pricing engine...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error && error !== 'No active pricing configuration found') {
        return (
            <DashboardLayout isAdmin>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="p-8 max-w-md text-center bg-destructive/5 rounded-2xl border border-destructive/20 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings2 className="w-8 h-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Engine Connectivity Error</h2>
                        <p className="text-sm text-muted-foreground mb-6">{error}</p>
                        <Button variant="outline" className="w-full gap-2" onClick={fetchConfig}>
                            <History className="w-4 h-4" /> Try Reconnecting
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!localConfig) return null;

    return (
        <DashboardLayout isAdmin>
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Pricing Revenue Manager</h1>
                        <p className="text-muted-foreground mt-1">Configure global pricing rules and priority-based logic.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 border-border/50 hover:bg-secondary">
                            <History className="w-4 h-4" /> Version History
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 border-border/50 hover:bg-secondary"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Draft
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary-glow text-white gap-2 shadow-glow transition-all duration-300"
                            onClick={handlePublishLive}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Publish Changes Live
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass-card overflow-hidden">
                            <CardHeader className="border-b border-border/50 bg-secondary/30">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl">Token Market Value</CardTitle>
                                        <CardDescription className="text-muted-foreground">Exchange rate used for client purchases (USD per Token).</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-primary/10 text-primary-glow border-primary/20">LIVE_RATE</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-8">
                                    <div className="flex-1 max-w-[240px] space-y-2">
                                        <Label className="text-muted-foreground">Market Rate ($)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                value={localConfig.tokenUsdPrice}
                                                onChange={(e) => setLocalConfig({ ...localConfig, tokenUsdPrice: parseFloat(e.target.value) })}
                                                className="text-3xl font-bold bg-background/50 border-border/50 h-16 pl-4"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">USD</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 bg-success/5 rounded-lg border border-success/10">
                                        <p className="text-sm text-success font-medium leading-relaxed">
                                            Current Tokenomics: $1.00 USD buys {(1 / (localConfig.tokenUsdPrice || 0.04)).toFixed(0)} tokens.
                                            Changes here reflect live in the client "Buy Tokens" dash.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card overflow-hidden">
                            <CardHeader className="border-b border-border/50 bg-secondary/30">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl">Global Base Price</CardTitle>
                                        <CardDescription className="text-muted-foreground">The starting token cost before any factors are applied.</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-lg py-1 px-4 border-primary/30 text-primary-glow font-display">
                                        v{localConfig.versionNumber} {localConfig.status === 'PUBLISHED' ? 'Active' : 'Draft'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-8">
                                    <div className="flex-1 max-w-[240px] space-y-2">
                                        <Label className="text-muted-foreground">Base Tokens</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={localConfig.basePrice}
                                                onChange={(e) => setLocalConfig({ ...localConfig, basePrice: parseFloat(e.target.value) })}
                                                className="text-3xl font-bold bg-background/50 border-border/50 h-16 pl-4"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">TKN</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                        <p className="text-sm text-primary-glow font-medium leading-relaxed">
                                            This price acts as the multiplier baseline. Total cost = (Base × Format × Priority × Duration × Screens).
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="factors" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-sidebar border border-border/50 p-1">
                                <TabsTrigger value="factors" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pricing Factors</TabsTrigger>
                                <TabsTrigger value="timeslots" className="data-[state=active]:bg-primary data-[state=active]:text-white">Time Slots</TabsTrigger>
                            </TabsList>

                            <TabsContent value="factors" className="mt-6 space-y-4">
                                {localConfig?.factors && [...localConfig.factors].sort((a: any, b: any) => b.priority - a.priority).map((factor: any) => {
                                    const index = localConfig.factors.findIndex((f: any) => f.id === factor.id);
                                    return (
                                        <Card key={factor.id || factor.key} className="glass-card group transition-all duration-300 hover:border-primary/30">
                                            <div className={`h-1.5 transition-all duration-300 ${factor.enabled ? 'bg-primary shadow-[0_0_10px_rgba(74,0,37,0.5)]' : 'bg-muted'}`} />
                                            <CardContent className="p-5 flex items-center gap-8">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1.5">
                                                        <Label className="font-bold text-lg text-foreground">{factor.name}</Label>
                                                        <Badge className={factor.type === 'MULTIPLIER' ? 'bg-primary/20 text-primary-glow' : 'bg-accent/20 text-accent-foreground'}>
                                                            {factor.type}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                                        <span>Priority: {factor.priority}</span>
                                                        <span className="opacity-30">|</span>
                                                        <span>Key: {factor.key}</span>
                                                    </div>
                                                </div>

                                                <div className="w-32 space-y-1.5">
                                                    <Label className="text-[10px] uppercase tracking-tighter text-muted-foreground">Value</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={factor.value}
                                                        className="bg-background/30 border-border/50 h-9 font-medium"
                                                        onChange={(e) => {
                                                            const newFactors = [...localConfig.factors];
                                                            newFactors[index].value = parseFloat(e.target.value);
                                                            setLocalConfig({ ...localConfig, factors: newFactors });
                                                        }}
                                                    />
                                                </div>

                                                <div className="w-48 px-4 space-y-1.5">
                                                    <Label className="text-[10px] uppercase tracking-tighter text-muted-foreground">Rank ({factor.priority})</Label>
                                                    <Slider
                                                        value={[factor.priority]}
                                                        min={1}
                                                        max={10}
                                                        step={1}
                                                        className="cursor-pointer"
                                                        onValueChange={([val]) => {
                                                            const newFactors = [...localConfig.factors];
                                                            newFactors[index].priority = val;
                                                            setLocalConfig({ ...localConfig, factors: newFactors });
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-col items-center gap-1.5">
                                                    <Label className="text-[10px] uppercase tracking-tighter text-muted-foreground">{factor.enabled ? 'Active' : 'Disabled'}</Label>
                                                    <Switch
                                                        checked={factor.enabled}
                                                        className="data-[state=checked]:bg-primary"
                                                        onCheckedChange={(val) => {
                                                            const newFactors = [...localConfig.factors];
                                                            newFactors[index].enabled = val;
                                                            setLocalConfig({ ...localConfig, factors: newFactors });
                                                        }}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </TabsContent>

                            <TabsContent value="timeslots" className="mt-6 space-y-4">
                                <div className="flex justify-end pr-1">
                                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 text-primary-glow">
                                        <Plus className="w-4 h-4" /> Add Peak Slot
                                    </Button>
                                </div>
                                <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-secondary/30">
                                            <TableRow className="hover:bg-transparent border-border/50">
                                                <TableHead className="text-muted-foreground">Slot Name</TableHead>
                                                <TableHead className="text-muted-foreground">Schedule</TableHead>
                                                <TableHead className="text-muted-foreground">Multiplier</TableHead>
                                                <TableHead className="text-muted-foreground">Priority</TableHead>
                                                <TableHead className="text-right text-muted-foreground pr-6">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {localConfig?.timeSlots?.map((slot: any) => (
                                                <TableRow key={slot.id} className="hover:bg-secondary/20 border-border/30">
                                                    <TableCell className="font-medium text-foreground py-4">{slot.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{slot.startTime} - {slot.endTime}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="border-primary/30 text-primary-glow px-2">
                                                            {slot.multiplier}x
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">P{slot.priority}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <Card className="glass-card border-primary/20 shadow-glow sticky top-6 overflow-hidden">
                            <CardHeader className="bg-primary text-white pb-6">
                                <CardTitle className="flex items-center gap-2 font-display text-xl">
                                    <Calculator className="w-6 h-6" /> Pricing Simulator
                                </CardTitle>
                                <CardDescription className="text-white/60">Test revenue outcomes with actual logic.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6 bg-card/50">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Label className="text-muted-foreground">Screens</Label>
                                        <span className="text-primary-glow font-bold">{simulationInput.screenCount}</span>
                                    </div>
                                    <Slider
                                        value={[simulationInput.screenCount]}
                                        min={1} max={50} step={1}
                                        className="cursor-pointer"
                                        onValueChange={([val]) => setSimulationInput({ ...simulationInput, screenCount: val })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Impressions / Day</Label>
                                    <Input
                                        type="number"
                                        value={simulationInput.impressionsPerDay}
                                        className="bg-background/50 border-border/50"
                                        onChange={(e) => setSimulationInput({ ...simulationInput, impressionsPerDay: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Priority</Label>
                                        <select
                                            className="w-full p-2.5 bg-background/50 border border-border/50 rounded-md text-sm text-foreground focus:border-primary outline-none"
                                            value={simulationInput.slotPriority}
                                            onChange={(e) => setSimulationInput({ ...simulationInput, slotPriority: e.target.value as any })}
                                        >
                                            <option value="NORMAL">Normal</option>
                                            <option value="HIGH">High</option>
                                            <option value="PREMIUM">Premium</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Format</Label>
                                        <select
                                            className="w-full p-2.5 bg-background/50 border border-border/50 rounded-md text-sm text-foreground focus:border-primary outline-none"
                                            value={simulationInput.adFormat}
                                            onChange={(e) => setSimulationInput({ ...simulationInput, adFormat: e.target.value as any })}
                                        >
                                            <option value="IMAGE">Image</option>
                                            <option value="GIF">GIF</option>
                                            <option value="MP4">Video (MP4)</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-primary hover:bg-primary-glow text-white h-12 shadow-glow font-bold tracking-wide"
                                    onClick={runSimulation}
                                >
                                    Calculate Projected Price
                                </Button>

                                {simulationResult && (
                                    <div className="mt-8 space-y-6 pt-6 border-t border-border/50 animate-slide-up">
                                        <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20 glow-subtle">
                                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Projected Token Cost</div>
                                            <div className="text-5xl font-display font-black text-primary-glow">{simulationResult.finalPrice}</div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Logic Breakdown</Label>
                                            <ScrollArea className="h-[280px] pr-4 rounded-lg bg-secondary/10 p-3">
                                                {simulationResult.breakdown.map((step: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center py-3 border-b border-border/10 last:border-0">
                                                        <div>
                                                            <div className="text-xs font-bold text-foreground mb-0.5">{step.factor}</div>
                                                            <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-70">
                                                                P{step.priority} • {step.type}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-xs font-bold ${step.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                                                                {step.change > 0 ? '+' : ''}{step.change.toFixed(2)}
                                                            </div>
                                                            <div className="text-[10px] font-mono font-bold text-foreground/80">{step.postValue.toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PricingManager;
