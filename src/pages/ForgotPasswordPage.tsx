import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/layout/Logo";
import { ArrowLeft, Mail, ShieldCheck, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Request, 2: Reset

    const { toast } = useToast();
    const { requestPasswordReset, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await requestPasswordReset(email);
            setStep(2);
            toast({
                title: "Code sent",
                description: "Check your email for the 6-digit verification code.",
            });
        } catch (error: any) {
            toast({
                title: "Request failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await resetPassword({ email, otp, newPassword });
            toast({
                title: "Success",
                description: "Password reset successful. Please login with your new password.",
            });
            navigate("/login");
        } catch (error: any) {
            toast({
                title: "Reset failed",
                description: error.message || "Invalid code or expired session.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
                <div className="absolute inset-0 pixel-grid opacity-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <Link to="/" className="flex justify-center mb-8">
                    <Logo size="lg" showTagline />
                </Link>

                <Card variant="elevated">
                    {step === 1 ? (
                        <>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Reset Password</CardTitle>
                                <CardDescription>
                                    Enter your email address and we'll send you a verification code.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRequest} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@company.com"
                                                className="pl-10 h-12 bg-background/50"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="hero"
                                        className="w-full shadow-glow"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            "Send Verification Code"
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            to="/login"
                                            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to sign in
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-2xl">Verify Security</CardTitle>
                                <CardDescription>
                                    Enter the code sent to <span className="font-semibold text-foreground">{email}</span>.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleReset} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Verification Code</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="6-digit code"
                                                className="pl-10 h-12 bg-background/50 font-mono tracking-widest"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="h-12 bg-background/50"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="hero"
                                        className="w-full shadow-glow"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Resetting...
                                            </span>
                                        ) : (
                                            "Update Password"
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Use a different email
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
