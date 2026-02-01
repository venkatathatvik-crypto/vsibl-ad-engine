import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Loader2, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signInWithGoogle, isLoading, isAuthenticated, user } = useAuth();
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (user?.role === 'CLIENT') {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await login({ email, password }, 'CLIENT');
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.message || "Something went wrong";

      toast({
        title: "Login failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormLoading(true);
    try {
      await signInWithGoogle('CLIENT');
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Login Error:", error);
      toast({
        title: "Google login failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects matching Admin Login */}
      <div className="absolute inset-0 pixel-grid z-0" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full border-border/50 shadow-glow bg-card/80 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 bg-primary shadow-glow" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary shadow-inner-glow">
              <User className="w-7 h-7" />
            </div>
            <CardTitle className="text-3xl font-display font-black tracking-tight text-white mb-1">VSIBL CLIENT</CardTitle>
            <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Client Intelligence Portal</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground ml-1">Account Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all rounded-lg"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-sm font-semibold text-muted-foreground">Access Token</Label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-bold text-primary hover:text-primary-glow transition-colors uppercase tracking-wider"
                  >
                    Lost Access?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all rounded-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow text-white h-14 font-bold text-md shadow-glow transition-all duration-300 transform active:scale-[0.98]"
                disabled={formLoading}
              >
                {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'INITIALIZE SESSION'}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-card px-2 text-muted-foreground/60">External Verification</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-background/30 border-border/50 hover:bg-primary/10 transition-all font-bold text-xs"
                disabled={formLoading}
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

              <div className="pt-4 text-center">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  New to VSIBL?{" "}
                  <Link to="/signup" className="text-primary hover:text-primary-glow font-bold ml-1 transition-colors">
                    Register Entity
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="text-[9px] text-muted-foreground/50 text-center uppercase tracking-[0.2em] mb-3">Debug Credentials</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-tight">
                <div className="p-2 rounded bg-background/40 border border-border/20 text-center">
                  <span className="block text-muted-foreground/40 mb-1">Client</span>
                  demo@vsibl.com
                </div>
                <div className="p-2 rounded bg-background/40 border border-border/20 text-center">
                  <span className="block text-muted-foreground/40 mb-1">Pass</span>
                  demo123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

