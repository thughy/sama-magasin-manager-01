
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Cashier from "./pages/Cashier";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Depots from "./pages/Depots";
import DepotReleaseOrders from "./pages/DepotReleaseOrders";
import DepotInventory from "./pages/DepotInventory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/depots" element={<Depots />} />
          <Route path="/depots/release-orders" element={<DepotReleaseOrders />} />
          <Route path="/depots/inventory" element={<DepotInventory />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
