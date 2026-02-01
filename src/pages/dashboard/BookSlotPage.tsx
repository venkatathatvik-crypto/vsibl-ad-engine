import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Calendar,
    Clock,
    Tv,
    Search,
    MapPin,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Car,
    Cloud,
    Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BookSlotPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        campaignName: "",
        slotFeature: "" // New Slot Feature
    });

    const [loading, setLoading] = useState(false);

    const handleConfirmBooking = () => {
        toast({
            title: "Slot Reserved Successfully",
            description: `Campaign "${bookingData.campaignName}" (${bookingData.slotFeature}) scheduled for ${bookingData.date}`,
        });
        navigate("/dashboard");
    };

    const calculateTokens = () => {
        const rate = bookingData.slotFeature === 'SKY' ? 50 : 20;
        return rate * 2; // Assuming 2 hour duration for now
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto pb-12">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight uppercase">SCHEDULE AD SPACES</h1>
                        <p className="text-muted-foreground">Select your advertising environment and set your schedule.</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto w-full px-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= 1 ? "bg-primary text-white shadow-glow" : "bg-card border border-border text-muted-foreground")}>1</div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Slot Type</span>
                    </div>
                    <div className={cn("h-[2px] w-full mx-4", step >= 2 ? "bg-primary" : "bg-border/30")} />
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= 2 ? "bg-primary text-white shadow-glow" : "bg-card border border-border text-muted-foreground")}>2</div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Plan</span>
                    </div>
                    <div className={cn("h-[2px] w-full mx-4", step >= 3 ? "bg-primary" : "bg-border/30")} />
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= 3 ? "bg-primary text-white shadow-glow" : "bg-card border border-border text-muted-foreground")}>3</div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Lock</span>
                    </div>
                </div>

                {/* Step Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Initializing VSIBL environment...</p>
                    </div>
                ) : step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black font-display tracking-tight text-white uppercase italic">Select Slot Feature</h2>
                            <p className="text-muted-foreground text-sm">Choose the environment for your creative deployment.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <Card
                                className={cn(
                                    "cursor-pointer transition-all duration-500 border-border/50 hover:border-primary/50 relative overflow-hidden group",
                                    bookingData.slotFeature === 'VSIBLE ROAD' ? "border-primary bg-primary/5 shadow-glow scale-[1.02]" : "bg-card/40 opacity-70 hover:opacity-100"
                                )}
                                onClick={() => setBookingData({ ...bookingData, slotFeature: 'VSIBLE ROAD' })}
                            >
                                <div className="h-1.5 bg-primary/20 group-hover:bg-primary transition-colors" />
                                {bookingData.slotFeature === 'VSIBLE ROAD' && <div className="absolute top-6 right-6"><CheckCircle2 className="w-6 h-6 text-primary shadow-glow" /></div>}
                                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner-glow">
                                        <Car className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black font-display tracking-tight text-white uppercase italic">VSIBLE ROAD</h3>
                                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Network of urban mobility screens. High-frequency street-level engagement for maximum city reach.</p>
                                    </div>
                                    <div className="pt-4 flex flex-col items-center">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-primary">20</span>
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tokens / Hour</span>
                                        </div>
                                        <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">STREET LEVEL</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className={cn(
                                    "cursor-pointer transition-all duration-500 border-border/50 hover:border-primary/50 relative overflow-hidden group",
                                    bookingData.slotFeature === 'VSIBLE SKY' ? "border-primary bg-primary/5 shadow-glow scale-[1.02]" : "bg-card/40 opacity-70 hover:opacity-100"
                                )}
                                onClick={() => setBookingData({ ...bookingData, slotFeature: 'VSIBLE SKY' })}
                            >
                                <div className="h-1.5 bg-primary/20 group-hover:bg-primary transition-colors" />
                                {bookingData.slotFeature === 'VSIBLE SKY' && <div className="absolute top-6 right-6"><CheckCircle2 className="w-6 h-6 text-primary shadow-glow" /></div>}
                                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner-glow">
                                        <Cloud className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black font-display tracking-tight text-white uppercase italic">VSIBLE SKY</h3>
                                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Premium high-altitude digital drones. Unmatched visual impact and prestige positioning.</p>
                                    </div>
                                    <div className="pt-4 flex flex-col items-center">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-primary">50</span>
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tokens / Hour</span>
                                        </div>
                                        <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">PREMIUM REACH</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button disabled={!bookingData.slotFeature} size="lg" className="h-16 px-16 text-lg font-bold shadow-glow" onClick={() => setStep(2)}>
                                NEXT STEP <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                                <CardHeader>
                                    <CardTitle className="uppercase font-display tracking-tight">Campaign Intelligence</CardTitle>
                                    <CardDescription>Configure your deployment schedule</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Campaign Identity</Label>
                                        <Input
                                            placeholder="e.g., Summer Launch 2024"
                                            className="h-14 bg-background/50 border-border/50 focus:border-primary transition-all rounded-xl"
                                            value={bookingData.campaignName}
                                            onChange={(e) => setBookingData({ ...bookingData, campaignName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Target Date</Label>
                                            <Input
                                                type="date"
                                                className="h-14 bg-background/50 border-border/50 focus:border-primary transition-all rounded-xl"
                                                value={bookingData.date}
                                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Start Hour</Label>
                                            <Input
                                                type="time"
                                                className="h-14 bg-background/50 border-border/50 focus:border-primary transition-all rounded-xl"
                                                value={bookingData.startTime}
                                                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">End Hour</Label>
                                            <Input
                                                type="time"
                                                className="h-14 bg-background/50 border-border/50 focus:border-primary transition-all rounded-xl"
                                                value={bookingData.endTime}
                                                onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 text-primary shadow-inner-glow">
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold uppercase tracking-wider">Operational Protocol</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Network availability is subject to real-time traffic and weather conditions. Your campaign will be prioritized based on the selected slot feature.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-primary/20 shadow-glow bg-card/80 backdrop-blur-xl h-fit">
                                <CardHeader className="pb-4">
                                    <CardTitle className="uppercase font-display text-sm tracking-widest">Selected Environment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            {bookingData.slotFeature === 'VSIBLE ROAD' ? <Car className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-black font-display italic text-white uppercase">{bookingData.slotFeature}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Active Network</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border/30">
                                        <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest">
                                            <span className="text-muted-foreground">Network Fee</span>
                                            <span className="text-white">{bookingData.slotFeature === 'VSIBLE SKY' ? '50' : '20'} TKN/HR</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest">
                                            <span className="text-muted-foreground">Protocol</span>
                                            <span className="text-primary-glow font-black">PRE-EMPTIVE</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Button
                                className="w-full h-16 text-lg font-bold shadow-glow"
                                disabled={!bookingData.date || !bookingData.startTime || !bookingData.endTime}
                                onClick={() => setStep(3)}
                            >
                                REVIEW PROTOCOL
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
                        <Card className="border-primary shadow-glow overflow-hidden bg-card/80 backdrop-blur-3xl">
                            <div className="h-2 bg-primary shadow-glow" />
                            <CardHeader className="text-center pb-8 pt-10">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-inner-glow">
                                    <CheckCircle2 className="w-10 h-10 text-primary" />
                                </div>
                                <CardTitle className="text-3xl font-display font-black tracking-tight uppercase italic">Finalize Commitment</CardTitle>
                                <CardDescription className="uppercase tracking-[0.3em] text-[10px] font-bold text-muted-foreground mt-2">Initialize VSIBL Network Lock</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 px-10">
                                <div className="space-y-6 p-8 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap className="w-24 h-24" />
                                    </div>
                                    <div className="flex flex-col gap-1 relative">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Campaign Identifier</span>
                                        <span className="text-2xl font-black font-display text-white uppercase italic">{bookingData.campaignName || "Draft Campaign"}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 relative text-center sm:text-left">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Environment</span>
                                            <span className="text-sm font-bold text-white uppercase italic tracking-tight">{bookingData.slotFeature}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Launch Date</span>
                                            <span className="text-sm font-bold text-white uppercase italic tracking-tight">{bookingData.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 relative">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Broadcast window</span>
                                        <span className="text-sm font-bold text-white uppercase italic tracking-tight font-mono">{bookingData.startTime} - {bookingData.endTime} IST</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-primary text-white rounded-2xl shadow-glow">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Final Token Commitment</span>
                                        <span className="font-bold text-xs uppercase">Fixed Network Rate</span>
                                    </div>
                                    <span className="text-3xl font-black font-display italic">{calculateTokens()}</span>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <Button className="w-full h-16 bg-white text-black hover:bg-white/90 font-black text-lg uppercase tracking-widest italic transition-all active:scale-95" onClick={handleConfirmBooking}>
                                        LOCK SLOT & FINISH
                                    </Button>
                                    <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-colors" onClick={() => setStep(2)}>
                                        Back to configuration
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
};

// Helper for Badge since it might not be imported or available in some contexts, but it's used in the code above.
const Badge = ({ children, variant, className }: any) => (
    <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", className)}>
        {children}
    </div>
);

export default BookSlotPage;

