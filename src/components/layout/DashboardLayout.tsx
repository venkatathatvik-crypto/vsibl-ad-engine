import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

const DashboardLayout = ({ children, isAdmin = false }: DashboardLayoutProps) => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      <main className="ml-64 transition-all duration-300">
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-2 text-center text-xs font-semibold text-amber-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>VSIBL Demo Mode Active (Mocked Authentication & API Data)</span>
          </div>
        )}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
