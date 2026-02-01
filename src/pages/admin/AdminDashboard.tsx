import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Tv,
  FileText,
  Coins,
  Check,
  X,
  Clock,
  AlertCircle,
  TrendingUp,
  Lock,
  MapPin,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Total Clients", value: data?.stats?.totalClients || "...", change: "+2 this week", changeType: "positive" as const, icon: Users },
    { title: "Active Screens", value: data?.stats?.activeScreens || "...", change: "Live Network", changeType: "positive" as const, icon: Tv },
    { title: "Pending Ads", value: data?.stats?.pendingApprovals || "...", change: "Awaiting review", changeType: "neutral" as const, icon: Clock },
    { title: "Revenue (Tokens)", value: data?.stats?.revenue?.toLocaleString() || "0", change: "Total Volume", changeType: "positive" as const, icon: TrendingUp },
  ];

  const pendingAds = [
    { id: "1", name: "Black Friday Sale", client: "RetailCo", submitted: "2 hours ago", type: "image" },
    { id: "2", name: "New Year Campaign", client: "TechStart", submitted: "5 hours ago", type: "video" },
  ];

  const recentActivity = data?.recentActivity || [
    { id: "1", action: "System Live", details: "Dashboard initialized", time: "Just now", type: "success" },
  ];

  const activityTypeStyles = {
    success: "text-success",
    info: "text-primary",
    warning: "text-warning",
    error: "text-destructive",
  };

  return (
    <DashboardLayout isAdmin>
      <div id="overview" className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and quick actions</p>
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <motion.div
            id="pending"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="scroll-mt-24"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning" />
                  Pending Approvals
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{ad.name}</p>
                          <p className="text-sm text-muted-foreground">{ad.client} · {ad.submitted}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {ad.type}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-success hover:text-success hover:bg-success/10">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            id="logs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="scroll-mt-24"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm">View Logs</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 shrink-0",
                        activity.type === "success" && "bg-success",
                        activity.type === "info" && "bg-primary",
                        activity.type === "warning" && "bg-warning",
                        activity.type === "error" && "bg-destructive"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-medium text-sm", activityTypeStyles[activity.type])}>
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{activity.details}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Tv className="w-5 h-5" />
                  <span>Push Ads to Screens</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => navigate('/admin/pricing')}
                >
                  <Coins className="w-5 h-5" />
                  <span>Manage Pricing</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => navigate('/admin/locations')}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Manage Locations</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-primary/20 hover:border-primary">
                  <FileText className="w-5 h-5" />
                  <span>System Logs</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 bg-amber-50/50 border-amber-200 hover:bg-amber-50"
                  onClick={() => navigate('/admin/login?reset=true')}
                >
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-900">Master Key & Security</span>
                  <span className="text-[10px] text-amber-600">Requires Email Verification</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="my-12 border-t border-border/50" />

      {/* Placeholders for other sections */}
      <div id="ads" className="scroll-mt-24 min-h-[50vh]">
        <h2 className="text-2xl font-bold font-display mb-4">All Ads</h2>
        <Card className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/10 border-dashed">
          Ads Management Module
        </Card>
      </div>

      <div className="my-12 border-t border-border/50" />

      <div id="clients" className="scroll-mt-24 min-h-[50vh]">
        <h2 className="text-2xl font-bold font-display mb-4">Clients</h2>
        <Card className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/10 border-dashed">
          Client Management Module
        </Card>
      </div>

      <div className="my-12 border-t border-border/50" />

      <div id="pricing" className="scroll-mt-24 min-h-[50vh]">
        <h2 className="text-2xl font-bold font-display mb-4">Token Pricing</h2>
        <Card className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/10 border-dashed">
          Pricing Configuration Module
        </Card>
      </div>

      <div className="my-12 border-t border-border/50" />

      <div id="screens" className="scroll-mt-24 min-h-[50vh]">
        <h2 className="text-2xl font-bold font-display mb-4">Screens</h2>
        <Card className="h-64 flex items-center justify-center text-muted-foreground bg-secondary/10 border-dashed">
          Screen Management Module
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
