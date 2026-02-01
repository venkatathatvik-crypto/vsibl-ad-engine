import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Loader2, User, Eye, EyeOff, Briefcase, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, isAuthenticated, isLoading, user } = useAuth();

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
      await register({ email, password, name });

      toast({
        title: "Account created!",
        description: "Welcome to VSIBL.",
      });

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Signup Error:", error);
      const msg = error.message || "Unable to create account";

      toast({
        title: "Signup failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const benefits = [
    "10,000+ Urban Screens",
    "Real-time GPS Tracking",
    "Token-based Pricing",
    "Advanced Analytics"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects matching Admin Login */}
      <div className="absolute inset-0 pixel-grid z-0" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 my-8"
      >
        <Card className="w-full border-border/50 shadow-glow bg-card/80 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 bg-primary shadow-glow" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary shadow-inner-glow">
              <User className="w-7 h-7" />
            </div>
            <CardTitle className="text-3xl font-display font-black tracking-tight text-white mb-1">REGISTER ENTITY</CardTitle>
            <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Onboard to Urban Intelligence</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-muted-foreground ml-1">Brand / Company Name</Label>
                <div className="relative group">
                  <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="name"
                    type="text"
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all rounded-lg"
                    placeholder="Acme Corp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground ml-1">Corporate Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all rounded-lg"
                    placeholder="security@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-muted-foreground ml-1">Security Key</Label>
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
                {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CREATE SECURE ACCOUNT'}
              </Button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  Existing Partner?{" "}
                  <Link to="/login" className="text-primary hover:text-primary-glow font-bold ml-1 transition-colors">
                    Access Portal
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="text-[9px] text-muted-foreground/50 text-center uppercase tracking-[0.2em] mb-4">Platform Capabilities</p>
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 p-2 rounded-lg bg-background/40 border border-border/20">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-tight">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;

