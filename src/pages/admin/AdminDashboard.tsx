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
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Clients", value: "342", change: "+18 this month", changeType: "positive" as const, icon: Users },
    { title: "Active Screens", value: "10,847", change: "98.2% uptime", changeType: "positive" as const, icon: Tv },
    { title: "Pending Ads", value: "23", change: "Awaiting approval", changeType: "neutral" as const, icon: Clock },
    { title: "Revenue (MTD)", value: "$48.2K", change: "+22% vs last month", changeType: "positive" as const, icon: TrendingUp },
  ];

  const pendingAds = [
    { id: "1", name: "Black Friday Sale", client: "RetailCo", submitted: "2 hours ago", type: "image" },
    { id: "2", name: "New Year Campaign", client: "TechStart", submitted: "5 hours ago", type: "video" },
    { id: "3", name: "Product Launch", client: "FoodBrand", submitted: "1 day ago", type: "image" },
  ];

  const recentActivity = [
    { id: "1", action: "Ad approved", details: "Holiday Promo by RetailMax", time: "10 min ago", type: "success" },
    { id: "2", action: "New client signup", details: "TechCorp Inc.", time: "30 min ago", type: "info" },
    { id: "3", action: "Screen offline", details: "Device #1842 in Zone 4", time: "45 min ago", type: "warning" },
    { id: "4", action: "Tokens purchased", details: "5,000 tokens by StartupXYZ", time: "1 hour ago", type: "success" },
    { id: "5", action: "Ad rejected", details: "Invalid content from NewBrand", time: "2 hours ago", type: "error" },
  ];

  const activityTypeStyles = {
    success: "text-success",
    info: "text-primary",
    warning: "text-warning",
    error: "text-destructive",
  };

  return (
    <DashboardLayout isAdmin>
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
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Coins className="w-5 h-5" />
                <span>Manage Pricing</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Users className="w-5 h-5" />
                <span>View All Clients</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <FileText className="w-5 h-5" />
                <span>System Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
