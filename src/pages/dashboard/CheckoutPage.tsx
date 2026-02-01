import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CreditCard,
    ShieldCheck,
    Zap,
    Lock,
    CheckCircle2,
    ArrowLeft,
    Wallet,
    Info
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsFinished(true);
            toast({
                title: "Purchase Successful",
                description: "Tokens have been added to your wallet.",
            });
        }, 3000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-12">
                <div className="flex items-center gap-4 mb-8">
                    {!isFinished && (
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight">SECURE CHECKOUT</h1>
                        <p className="text-muted-foreground">Complete your token purchase via our encrypted gateway.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left: Payment Form */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {!isFinished ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Card className="bg-card/50 border-border/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-primary" />
                                                Card Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handlePayment} className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label>Cardholder Name</Label>
                                                    <Input placeholder="John Doe" required className="h-12 bg-background/50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Card Number</Label>
                                                    <div className="relative">
                                                        <Input placeholder="0000 0000 0000 0000" required className="h-12 bg-background/50 font-mono tracking-widest pl-12" />
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Expiry Date</Label>
                                                        <Input placeholder="MM/YY" required className="h-12 bg-background/50" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>CVV</Label>
                                                        <Input placeholder="***" type="password" required className="h-12 bg-background/50" />
                                                    </div>
                                                </div>
                                                <div className="pt-4">
                                                    <Button
                                                        disabled={isProcessing}
                                                        className="w-full h-14 bg-primary hover:bg-primary-glow text-white font-bold text-lg shadow-glow transition-all"
                                                    >
                                                        {isProcessing ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                ENCRYPTING...
                                                            </div>
                                                        ) : "CONFIRM & PAY $199.00"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                        <CardFooter className="flex justify-center border-t border-border/30 bg-secondary/10 px-6 py-4">
                                            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                                <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secure</div>
                                                <div className="flex items-center gap-1"><Info className="w-3 h-3" /> PCI Compliant</div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-success shadow-glow" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-display mb-2">Order Confirmed!</h2>
                                    <p className="text-muted-foreground mb-8">Your balance has been updated instantly.</p>
                                    <Button size="lg" className="px-12 h-14" onClick={() => navigate("/dashboard")}>
                                        RETURN TO DASHBOARD
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-card/50 border-primary/20 sticky top-4 overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <CardHeader>
                                <CardTitle className="text-sm uppercase font-black tracking-widest text-muted-foreground">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Growth Package</p>
                                            <p className="text-xs text-muted-foreground">5,000 VSIBL Tokens</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">$199.00</span>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-border/30">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>$199.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Network Fee</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                                        <span className="font-bold text-lg">Total</span>
                                        <span className="text-2xl font-black font-display text-primary">$199.00</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 space-y-4">
                            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
                                <Wallet className="w-4 h-4 text-primary" /> Current Wallet
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black font-display opacity-40">12,450</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase">+ 5,000 pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CheckoutPage;
