import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import LiveMap from "@/components/dashboard/LiveMap";
import {
  GoLiveUploadWidget,
  TokenPurchaseWidget,
  ScheduleAdsWidget,
  HeatMapWidget,
  DailyEngagementWidget,
  CampaignLeadsWidget,
  TransactionHistoryWidget
} from "@/components/dashboard/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Tv, Coins, Upload, TrendingUp, MousePointer2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();
  // Mock data for top buttons (already existing)
  const stats = [
    {
      title: "Get Tokens",
      value: "12,450",
      change: "Click to Top Up",
      changeType: "positive" as const,
      icon: Coins,
      href: "#tokens"
    },
    {
      title: "Active Screens",
      value: "1,247",
      change: "View Live Map",
      changeType: "positive" as const,
      icon: Tv,
      href: "#map"
    },
    {
      title: "Active Ads",
      value: "8",
      change: "Manage Assets",
      changeType: "neutral" as const,
      icon: TrendingUp,
      href: "#ads"
    },
    {
      title: "Avg Interaction",
      value: "12.4%",
      change: "View Analytics",
      changeType: "positive" as const,
      icon: MousePointer2,
      href: "#analytics"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">CLIENT DASHBOARD</h1>
            <p className="text-muted-foreground">Strategic overview of your advertising ecosystem.</p>
          </div>
        </div>

        {/* Top 4 Buttons (Stat Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* MAIN SPLIT LAYOUT */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Row 1: Go Live & Token Purchase */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <GoLiveUploadWidget />
          </motion.div>
          <motion.div id="tokens" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <TokenPurchaseWidget />
          </motion.div>

          {/* Row 2: Schedule & Live Screens */}
          <motion.div id="ads" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <ScheduleAdsWidget />
          </motion.div>
          <motion.div id="map" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <LiveMap />
          </motion.div>

          {/* Row 3: Heat Map & Daily Engagement */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <HeatMapWidget />
          </motion.div>
          <motion.div id="analytics" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <DailyEngagementWidget />
          </motion.div>
        </div>

        {/* FULL WIDTH SECTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <CampaignLeadsWidget />
          <TransactionHistoryWidget />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
