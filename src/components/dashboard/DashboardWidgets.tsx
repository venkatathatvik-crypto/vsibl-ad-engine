import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Upload,
    Coins,
    Calendar,
    Map as MapIcon,
    TrendingUp,
    Users,
    History,
    ArrowUpRight,
    Search,
    ChevronRight,
    Clock,
    Zap,
    MousePointer2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from "recharts";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// --- WIDGET 1: Go Live Upload ---
export const GoLiveUploadWidget = () => {
    const navigate = useNavigate();
    return (
        <Card className="h-full group hover:border-primary/50 transition-all duration-300 shadow-lg bg-card/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Go Live Now
                </CardTitle>
                <CardDescription>Launch your next campaign instantly</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:bg-primary/30 transition-all" />
                    <div className="relative w-24 h-24 rounded-full bg-primary/10 border-2 border-dashed border-primary/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Upload className="w-10 h-10 text-primary animate-bounce-subtle" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-lg">Drag & Drop Creative</p>
                    <p className="text-sm text-muted-foreground">Supported: MP4, PNG, JPG (Max 50MB)</p>
                </div>
                <Button variant="hero" className="w-full" onClick={() => navigate("/dashboard/upload")}>
                    UPLOAD NOW
                </Button>
            </CardContent>
        </Card>
    );
};

import { usePricingStore } from "@/store/usePricingStore";

// --- WIDGET 2: Token Price Calculation / Buying ---
export const TokenPurchaseWidget = () => {
    const { activeConfig, fetchConfig } = usePricingStore();
    const [tokens, setTokens] = useState(5000);
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeConfig) fetchConfig();
    }, [activeConfig, fetchConfig]);

    const rate = activeConfig?.tokenUsdPrice || 0.04;
    const price = (tokens * rate).toFixed(2);

    return (
        <Card className="h-full bg-card/50 backdrop-blur-xl border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-primary" />
                    Buy Tokens
                </CardTitle>
                <CardDescription>Current rate: ${rate.toFixed(4)} per token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Estimate Cost</span>
                        <div className="flex items-center gap-1 text-primary">
                            <Zap className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Flash Rate</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-4xl font-black font-display text-white">${price}</span>
                        <span className="text-sm text-muted-foreground mb-1">USD for {tokens.toLocaleString()} tokens</span>
                    </div>
                    <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={tokens}
                        onChange={(e) => setTokens(parseInt(e.target.value))}
                        className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary mt-4"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Screen Minutes</p>
                        <p className="text-lg font-bold">~{(tokens * 2).toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Network Reach</p>
                        <p className="text-lg font-bold">Global</p>
                    </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary-glow text-white h-12 font-bold shadow-glow" onClick={() => navigate("/dashboard/checkout")}>
                    PROCEED TO CHECKOUT
                </Button>
            </CardContent>
        </Card>
    );
};

// --- WIDGET 3: Schedule Ads ---
export const ScheduleAdsWidget = () => {
    const navigate = useNavigate();
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Schedule Ads
                    </CardTitle>
                    <CardDescription>Manage your upcoming slots</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/book-slot")}><ChevronRight className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[
                        { name: 'Summer Launch', feature: 'VSIBLE ROAD', time: '14:00 - 16:00', date: 'Jan 22', status: 'Confirmed' },
                        { name: 'Brand Story', feature: 'VSIBLE SKY', time: '08:00 - 11:00', date: 'Jan 23', status: 'Pending' },
                        { name: 'Product Drop', feature: 'VSIBLE ROAD', time: '21:00 - 23:00', date: 'Jan 23', status: 'Confirmed' },
                        { name: 'Global Reveal', feature: 'VSIBLE SKY', time: '10:00 - 14:00', date: 'Jan 24', status: 'Confirmed' },
                    ].map((slot, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {slot.date.split(' ')[1]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{slot.name}</p>
                                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary-glow uppercase tracking-tighter">{slot.feature}</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {slot.time}
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                slot.status === 'Confirmed' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                            )}>
                                {slot.status}
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-6 border-dashed" onClick={() => navigate("/dashboard/book-slot")}>
                    ADD NEW SLOT
                </Button>
            </CardContent>
        </Card>
    );
};

// --- WIDGET 4: Heat Map ---
export const HeatMapWidget = () => (
    <Card className="h-full overflow-hidden">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <MousePointer2 className="w-5 h-5 text-primary" />
                Heat Map
            </CardTitle>
            <CardDescription>Real-time interaction density</CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative h-[300px]">
            {/* Mock Heatmap using CSS Gradients/Blur */}
            <div className="absolute inset-0 bg-[#0a0a0b] opacity-50 pixel-grid" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/40 blur-[60px] rounded-full animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/30 blur-[80px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/20 blur-[50px] rounded-full animate-pulse" />

                    {/* Simulated Map Outline */}
                    <div className="absolute inset-8 border border-white/5 rounded-2xl opacity-20 border-dashed" />

                    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-primary rounded-full shadow-glow" />
                    <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-primary rounded-full shadow-glow" />
                    <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-accent rounded-full shadow-glow" />
                </div>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-glow" />
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">High Interaction</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Conversion</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

// --- WIDGET 5: Daily Engagement ---
export const DailyEngagementWidget = () => {
    const data = [
        { name: "00:00", val: 400 },
        { name: "04:00", val: 300 },
        { name: "08:00", val: 1200 },
        { name: "12:00", val: 1800 },
        { name: "16:00", val: 1500 },
        { name: "20:00", val: 2100 },
        { name: "23:59", val: 900 },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Daily Engagement
                </CardTitle>
                <CardDescription>Hourly audience interaction flow</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#555"
                                tick={{ fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#555"
                                tick={{ fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--primary))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="val"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#engGradient)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// --- WIDGET 6: Campaign Leads ---
export const CampaignLeadsWidget = () => {
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const leads = [
        { name: 'Marina Beach Digital', type: 'QR Scan', score: '98%', time: '2 mins ago', location: 'Section A, Entrance', device: 'DS-01' },
        { name: 'T-Nagar Hub', type: 'Augmented View', score: '85%', time: '14 mins ago', location: 'Main Atrium', device: 'DS-04' },
        { name: 'OMR Food Street', type: 'Touch Interaction', score: '92%', time: '1 hour ago', location: 'Food Court', device: 'DS-09' },
        { name: 'Phoenix Marketcity', type: 'NFC Tap', score: '76%', time: '3 hours ago', location: 'Level 2, West', device: 'DS-12' },
        { name: 'Velachery Cross', type: 'QR Scan', score: '89%', time: '5 hours ago', location: 'Near Exit', device: 'DS-03' },
    ];

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Campaign Leads
                    </CardTitle>
                    <CardDescription>Qualified interactions from recent displays</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            className="bg-secondary/50 border border-border/50 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 ring-primary outline-none w-64"
                            placeholder="Search leads..."
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-muted-foreground uppercase font-black border-b border-border/50">
                            <tr>
                                <th className="px-4 py-3">Lead Source</th>
                                <th className="px-4 py-3">Interaction Type</th>
                                <th className="px-4 py-3 text-center">Quality Score</th>
                                <th className="px-4 py-3">Time Detected</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {leads.map((lead, i) => (
                                <tr key={i} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-4 py-4 font-semibold">{lead.name}</td>
                                    <td className="px-4 py-4 text-muted-foreground">{lead.type}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                            {lead.score}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-muted-foreground">{lead.time}</td>
                                    <td className="px-4 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="group-hover:text-primary"
                                            onClick={() => setSelectedLead(lead)}
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>

            <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
                <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Lead Details
                        </DialogTitle>
                        <DialogDescription>
                            Comprehensive breakdown of detected interaction.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLead && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Source</p>
                                    <p className="text-sm font-semibold">{selectedLead.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Interaction</p>
                                    <p className="text-sm font-semibold">{selectedLead.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</p>
                                    <p className="text-sm font-semibold">{selectedLead.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Device ID</p>
                                    <p className="text-sm font-semibold font-mono">{selectedLead.device}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                    <span className="text-sm font-medium">Quality Conversion Score</span>
                                </div>
                                <span className="text-2xl font-black font-display text-primary">{selectedLead.score}</span>
                            </div>
                            <Button className="w-full" variant="outline" onClick={() => setSelectedLead(null)}>
                                Close Details
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
};

// --- WIDGET 7: Transaction History ---
export const TransactionHistoryWidget = () => {
    const handleDownloadReport = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Preparing financial report...',
                success: 'Report downloaded successfully',
                error: 'Failed to generate report',
            }
        );
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Transaction History
                    </CardTitle>
                    <CardDescription>Recent token credits and campaign spending</CardDescription>
                </div>
                <Button
                    variant="link"
                    className="text-primary text-xs font-bold uppercase tracking-widest"
                    onClick={handleDownloadReport}
                >
                    Download PDF Report
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {[
                        { title: 'Token Purchase - Package Growth', id: 'TX-9482', type: 'CREDIT', amount: '+5,000', date: 'Jan 18, 2024' },
                        { title: 'Campaign Reservation: Pongal Special', id: 'TX-9431', type: 'DEBIT', amount: '-1,200', date: 'Jan 17, 2024' },
                        { title: 'Campaign Reservation: Chennai Silks', id: 'TX-9410', type: 'DEBIT', amount: '-2,400', date: 'Jan 16, 2024' },
                        { title: 'Token Purchase - Package Starter', id: 'TX-9388', type: 'CREDIT', amount: '+1,000', date: 'Jan 15, 2024' },
                    ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-xl group transition-all">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center bg-card",
                                    tx.type === 'CREDIT' ? "text-success border border-success/20" : "text-destructive border border-destructive/20"
                                )}>
                                    {tx.type === 'CREDIT' ? <CheckCircle2 className="w-5 h-5" /> : <ArrowUpRight className="rotate-180 w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{tx.title}</p>
                                    <p className="text-[11px] text-muted-foreground font-mono">{tx.id} • {tx.date}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "font-black font-display text-lg",
                                tx.type === 'CREDIT' ? "text-success" : "text-white"
                            )}>
                                {tx.amount} <span className="text-[11px] font-normal text-muted-foreground">Tokens</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
