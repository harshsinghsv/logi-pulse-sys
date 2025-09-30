import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Overview from "./components/Dashboard/Overview";
import RakePlans from "./components/Dashboard/RakePlans";
import OrderManagement from "./components/Dashboard/OrderManagement";
import Resources from "./components/Dashboard/Resources";
import LiveTracking from "./components/Dashboard/LiveTracking";
import Simulations from "./components/Dashboard/Simulations";
import AnalyticsReports from "./components/Dashboard/AnalyticsReports";
import Alerts from "./components/Dashboard/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="plans" element={<RakePlans />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="resources" element={<Resources />} />
            <Route path="tracking" element={<LiveTracking />} />
            <Route path="simulations" element={<Simulations />} />
            <Route path="analytics" element={<AnalyticsReports />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
