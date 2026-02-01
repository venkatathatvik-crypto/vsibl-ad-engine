import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showReset, setShowReset] = useState(false);

    const [resetStep, setResetStep] = useState(1); // 1: Request, 2: Verify
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login, signInWithGoogle, requestPasswordReset, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login({ email, password }, 'ADMIN');
            navigate('/admin/pricing');
        } catch (err: any) {
            toast.error(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle('ADMIN');
            navigate('/admin/pricing');
        } catch (error: any) {
            toast.error(error.message || 'Google login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestReset = async () => {
        if (!email) {
            toast.error('Enter your admin email first');
            return;
        }
        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setResetStep(2);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmReset = async () => {
        if (!resetToken || !newPassword) {
            toast.error('Code and new password are required');
            return;
        }
        setIsLoading(true);
        try {
            await resetPassword({ email, otp: resetToken, newPassword });
            setShowReset(false);
            setResetStep(1);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 pixel-grid">
            <Card className="w-full max-w-md border-border/50 shadow-glow bg-card/80 backdrop-blur-xl overflow-hidden animate-fade-in">
                <div className="h-1.5 bg-primary shadow-glow" />
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary shadow-inner-glow">
                        <Lock className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-3xl font-display font-black tracking-tight text-white mb-1">VSIBL ADMIN</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">System Configuration Gateway</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {!showReset ? (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground ml-1">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all rounded-lg"
                                        placeholder="admin@vsibl.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label htmlFor="password" className="text-sm font-semibold text-muted-foreground">Security Key</Label>
                                    <button
                                        type="button"
                                        className="text-[11px] font-bold text-primary hover:text-primary-glow transition-colors uppercase tracking-wider"
                                        onClick={() => setShowReset(true)}
                                    >
                                        Credential Recovery?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all rounded-lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-glow text-white h-14 font-bold text-md shadow-glow transition-all duration-300 transform active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'AUTHENTICATE & ENTER'}
                            </Button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border/30" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                                    <span className="bg-card px-2 text-muted-foreground/60">System Identity Link</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleLogin}
                                className="w-full h-12 bg-background/30 border-border/50 hover:bg-primary/10 transition-all font-bold text-xs"
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                CONTINUE WITH GOOGLE
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="p-3.5 bg-warning/10 border border-warning/20 rounded-xl flex gap-3 text-warning text-[13px] leading-relaxed">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                                <p>Security verification required. A code will be sent to the primary administrative email address.</p>
                            </div>

                            {resetStep === 1 ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-muted-foreground ml-1">Current Admin Email</Label>
                                        <Input
                                            placeholder="Enter registered email"
                                            className="h-12 bg-background/50 border-border/50"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full h-12 font-bold border-border/50 hover:bg-secondary" variant="outline" onClick={handleRequestReset} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEND VERIFICATION CODE'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-muted-foreground ml-1">Verification Code</Label>
                                        <Input
                                            placeholder="6-digit code"
                                            className="h-12 bg-background/50 border-border/50 font-mono tracking-widest text-center text-lg"
                                            value={resetToken}
                                            onChange={(e) => setResetToken(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-muted-foreground ml-1">New Security Key</Label>
                                        <Input
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            className="h-12 bg-background/50 border-border/50"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full h-14 bg-primary text-white font-bold text-md shadow-glow active:scale-[0.98] transition-all" onClick={handleConfirmReset} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'UPDATE & SECURE'}
                                    </Button>
                                </div>
                            )}
                            <Button variant="ghost" className="w-full text-[11px] font-bold tracking-widest text-muted-foreground hover:text-white uppercase" onClick={() => setShowReset(false)}>
                                Back to Login
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLoginPage;
