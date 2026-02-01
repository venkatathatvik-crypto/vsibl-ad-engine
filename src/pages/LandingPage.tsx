import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Logo from "@/components/layout/Logo";
import { ArrowRight, Tv, MapPin, Coins, BarChart3 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: Tv,
      title: "Multi-Environment Network",
      description: "Choose between VSIBLE ROAD for urban mobility or VSIBLE SKY for premium high-altitude visibility.",
    },
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Watch your ads travel through the city with live GPS hotspot mapping.",
    },
    {
      icon: Coins,
      title: "Token Economy",
      description: "Pay only for actual screen time with our flexible token-based billing.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track impressions, engagement, and ROI with detailed analytics.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

          {/* Pixel grid pattern */}
          <div className="absolute inset-0 pixel-grid opacity-20" />

          {/* Scattered pixels */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/40 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center -mb-28"
            >
              <Logo size="4xl" showTagline />
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
              ADVERTISE WHERE THE{" "}
              <span className="relative">
                <span className="relative z-10 text-foreground">CITY MOVES</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/50 -z-0" />
              </span>
            </h1>



            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/signup">
                      Start Advertising
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="xl" asChild>
                    <Link to="/login">
                      Access Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <Button variant="hero" size="xl" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
            >
              {[
                { value: "10K+", label: "Active Screens" },
                { value: "50M+", label: "Daily Impressions" },
                { value: "15+", label: "Cities" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold font-display text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Powerful Advertising Platform
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run successful urban advertising campaigns
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 gradient-glow" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center p-12 rounded-2xl bg-card border border-primary/30 shadow-glow"
          >
            <h2 className="text-3xl font-bold font-display mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of brands already advertising on VSIBL's urban network.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 VSIBL. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
