import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import TokenWallet from "@/components/dashboard/TokenWallet";
import AdsTable from "@/components/dashboard/AdsTable";
import LiveMap from "@/components/dashboard/LiveMap";
import UploadAdSection from "@/components/dashboard/UploadAdSection";
import BuyTokensSection from "@/components/dashboard/BuyTokensSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tv, BarChart3, Coins, Upload, TrendingUp, Clock, Calendar } from "lucide-react";

const ClientDashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Active Screens",
      value: "1,247",
      change: "+12% from last week",
      changeType: "positive" as const,
      icon: Tv
    },
    {
      title: "Total Impressions",
      value: "2.4M",
      change: "+8% from last week",
      changeType: "positive" as const,
      icon: BarChart3
    },
    {
      title: "Active Ads",
      value: "8",
      change: "3 pending approval",
      changeType: "neutral" as const,
      icon: TrendingUp
    },
    {
      title: "Avg. Duration",
      value: "4.2h",
      change: "per screen/day",
      changeType: "neutral" as const,
      icon: Clock
    },
  ];

  const recentAds = [
    { id: "1", name: "Summer Sale 2024", status: "active" as const, impressions: 245000, screens: 450, createdAt: "Dec 5, 2024" },
    { id: "2", name: "Brand Awareness", status: "approved" as const, impressions: 0, screens: 0, createdAt: "Dec 4, 2024" },
    { id: "3", name: "New Product Launch", status: "pending" as const, impressions: 0, screens: 0, createdAt: "Dec 4, 2024" },
    { id: "4", name: "Holiday Special", status: "active" as const, impressions: 180000, screens: 320, createdAt: "Dec 3, 2024" },
    { id: "5", name: "Flash Sale", status: "expired" as const, impressions: 520000, screens: 680, createdAt: "Nov 28, 2024" },
  ];

  return (
    <DashboardLayout>
      <div id="dashboard" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your advertising overview.</p>
          </div>
          <Button variant="hero" asChild>
            <a href="#upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Ad
            </a>
          </Button>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Token Wallet */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TokenWallet available={12450} used={7550} total={20000} />
          </motion.div>

          {/* Right Column - Map */}
          <motion.div
            id="map"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 scroll-mt-24"
          >
            <LiveMap />
          </motion.div>
        </div>

        {/* Ads Table */}
        <motion.div
          id="ads"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="scroll-mt-24"
        >
          <AdsTable ads={recentAds} />
        </motion.div>
      </div>

      <div className="my-12 border-t border-border/50" />

      {/* Schedule Section */}
      <div id="schedule" className="scroll-mt-24 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-display mb-6">Ad Schedule</h2>
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>See ur scheduled Ads Here.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-12 border-t border-border/50" />

      {/* Upload Section */}
      <div id="upload" className="scroll-mt-24 min-h-[80vh]">
        <UploadAdSection />
      </div>

      <div className="my-12 border-t border-border/50" />

      {/* Tokens Section */}
      <div id="tokens" className="scroll-mt-24 min-h-[80vh]">
        <BuyTokensSection />
      </div>

      <div className="my-12 border-t border-border/50" />

      {/* Transactions Section */}
      <div id="transactions" className="scroll-mt-24 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-display mb-6">Transaction History</h2>
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="p-8 text-center text-muted-foreground">
              <Coins className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No transactions found for this period.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
