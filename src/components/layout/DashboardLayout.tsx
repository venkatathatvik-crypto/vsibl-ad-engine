import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

const DashboardLayout = ({ children, isAdmin = false }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      <main className="ml-64 transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
