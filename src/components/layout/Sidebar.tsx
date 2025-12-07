import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import {
  LayoutDashboard,
  Upload,
  Calendar,
  MapPin,
  Coins,
  History,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isAdmin?: boolean;
}

const clientLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard#dashboard" },
  { icon: Upload, label: "Upload Ad", path: "/dashboard#upload" },
  { icon: Calendar, label: "Schedule", path: "/dashboard#schedule" },
  { icon: MapPin, label: "Live Map", path: "/dashboard#map" },
  { icon: Coins, label: "Buy Tokens", path: "/dashboard#tokens" },
  { icon: History, label: "Transactions", path: "/dashboard#transactions" },
  { icon: FileText, label: "My Ads", path: "/dashboard#ads" },
];

const adminLinks = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin#overview" },
  { icon: FileText, label: "Pending Approvals", path: "/admin#pending" },
  { icon: FileText, label: "All Ads", path: "/admin#ads" },
  { icon: Coins, label: "Clients", path: "/admin#clients" },
  { icon: Settings, label: "Token Pricing", path: "/admin#pricing" },
  { icon: MapPin, label: "Screens", path: "/admin#screens" },
  { icon: History, label: "System Logs", path: "/admin#logs" },
];

const Sidebar = ({ isAdmin = false }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center">
          {collapsed ? (
            <Logo size="sm" />
          ) : (
            <Logo size="md" />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isHashLink = link.path.includes("#");
          const currentPath = location.pathname + location.hash;

          // For hash links, match exact path+hash, or default to dashboard if hash is empty/dashboard
          let isActive = false;
          if (isHashLink) {
            if (link.path.endsWith("#dashboard") && (currentPath === "/dashboard" || currentPath === "/dashboard#dashboard")) {
              isActive = true;
            } else {
              isActive = currentPath === link.path;
            }
          } else {
            isActive = location.pathname === link.path;
          }

          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "nav-item",
                isActive && "active",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          to="/settings"
          className={cn(
            "nav-item",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link
          to="/login"
          className={cn(
            "nav-item text-destructive hover:text-destructive",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-20 bg-card border border-border rounded-full shadow-lg"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
    </aside>
  );
};

export default Sidebar;
