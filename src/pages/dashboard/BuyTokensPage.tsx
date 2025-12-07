import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Check, Star, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BuyTokensPage = () => {
  const { toast } = useToast();

  const packages = [
    {
      id: "starter",
      name: "Starter",
      tokens: 1000,
      price: 49,
      description: "Perfect for testing the waters",
      icon: Coins,
      features: ["1,000 tokens", "~2,000 screen minutes", "Basic analytics"],
    },
    {
      id: "growth",
      name: "Growth",
      tokens: 5000,
      price: 199,
      description: "Ideal for growing brands",
      icon: Zap,
      popular: true,
      features: ["5,000 tokens", "~10,000 screen minutes", "Priority support", "Detailed analytics"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tokens: 20000,
      price: 699,
      description: "For large-scale campaigns",
      icon: Crown,
      features: ["20,000 tokens", "~40,000 screen minutes", "Dedicated manager", "Custom reporting", "API access"],
    },
  ];

  const handlePurchase = (packageName: string, tokens: number) => {
    toast({
      title: "Redirecting to payment...",
      description: `Purchasing ${tokens.toLocaleString()} tokens`,
    });
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-display mb-3">Buy Tokens</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Purchase VSIBL tokens to run your ads. Tokens are consumed based on screen time and number of screens.
          </p>
        </div>

        {/* Token Info */}
        <Card variant="glow" className="mb-12">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold font-display text-primary">1 token</p>
                <p className="text-sm text-muted-foreground mt-1">=  1 screen × 2 minutes</p>
              </div>
              <div>
                <p className="text-4xl font-bold font-display">No expiry</p>
                <p className="text-sm text-muted-foreground mt-1">Tokens never expire</p>
              </div>
              <div>
                <p className="text-4xl font-bold font-display">Real-time</p>
                <p className="text-sm text-muted-foreground mt-1">Deductions are tracked live</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "relative h-full transition-all duration-300 hover:shadow-glow",
                  pkg.popular && "border-primary/50 shadow-glow"
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <pkg.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div>
                    <p className="text-5xl font-bold font-display">
                      ${pkg.price}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.tokens.toLocaleString()} tokens
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={pkg.popular ? "hero" : "outline"}
                    className="w-full"
                    onClick={() => handlePurchase(pkg.name, pkg.tokens)}
                  >
                    Purchase {pkg.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Custom Amount */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold font-display mb-2">Need more tokens?</h3>
            <p className="text-muted-foreground mb-4">
              Contact us for custom token packages and enterprise pricing.
            </p>
            <Button variant="outline">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default BuyTokensPage;
