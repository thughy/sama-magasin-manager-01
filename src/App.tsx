
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductCategories from "./pages/ProductCategories";
import Clients from "./pages/Clients";
import ClientsList from "./pages/Clients"; // Using same component for both routes
import ClientProforma from "./pages/ClientProforma"; // New import for the Proforma page
import ClientInvoicing from "./pages/ClientInvoicing"; // New import for the Invoicing page
import Cashier from "./pages/Cashier";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Purchases from "./pages/Purchases";
import SupplierPayments from "./pages/SupplierPayments";
import PaymentJournal from "./pages/PaymentJournal";
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
          <Route path="/products/categories" element={<ProductCategories />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/list" element={<ClientsList />} />
          <Route path="/clients/proforma" element={<ClientProforma />} />
          <Route path="/clients/invoicing" element={<ClientInvoicing />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/suppliers/purchases" element={<Purchases />} />
          <Route path="/suppliers/payments" element={<SupplierPayments />} />
          <Route path="/suppliers/payment-journal" element={<PaymentJournal />} />
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
