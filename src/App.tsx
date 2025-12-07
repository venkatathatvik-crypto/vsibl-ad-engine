import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import UploadAdPage from "./pages/dashboard/UploadAdPage";
import BuyTokensPage from "./pages/dashboard/BuyTokensPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ScrollToHashElement from "./components/ScrollToHashElement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHashElement />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Client Dashboard Routes */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/dashboard/upload" element={<UploadAdPage />} />
          <Route path="/dashboard/tokens" element={<BuyTokensPage />} />
          <Route path="/dashboard/schedule" element={<ClientDashboard />} />
          <Route path="/dashboard/map" element={<ClientDashboard />} />
          <Route path="/dashboard/transactions" element={<ClientDashboard />} />
          <Route path="/dashboard/ads" element={<ClientDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pending" element={<AdminDashboard />} />
          <Route path="/admin/ads" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<AdminDashboard />} />
          <Route path="/admin/pricing" element={<AdminDashboard />} />
          <Route path="/admin/screens" element={<AdminDashboard />} />
          <Route path="/admin/logs" element={<AdminDashboard />} />

          {/* Settings */}
          <Route path="/settings" element={<ClientDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
