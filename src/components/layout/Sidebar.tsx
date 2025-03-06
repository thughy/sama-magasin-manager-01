
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  Store, 
  LayoutDashboard, 
  Package, 
  Users, 
  CreditCard, 
  ShoppingCart, 
  Truck, 
  Settings,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type NavItem = {
  title: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { title: "Tableau de bord", icon: LayoutDashboard, href: "/" },
  { title: "Produits", icon: Package, href: "/products" },
  { title: "Clients", icon: Users, href: "/clients" },
  { title: "Caisse", icon: CreditCard, href: "/cashier" },
  { title: "Ventes", icon: ShoppingCart, href: "/sales" },
  { title: "Fournisseurs", icon: Truck, href: "/suppliers" },
  { title: "Paramètres", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu trigger */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMobileSidebar}
          className="rounded-full shadow-md"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar header with logo */}
        <div className="flex items-center h-16 px-4 border-b">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="bg-sama-500 text-white p-2 rounded-md">
              <Store size={20} />
            </div>
            {!collapsed && (
              <span className="text-xl font-semibold tracking-tight animate-fade-in">
                SAMA MAGASIN
              </span>
            )}
          </div>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              <ChevronLeft
                size={18}
                className={cn(
                  "transition-transform duration-300",
                  collapsed && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-2 space-y-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center h-10 px-3 py-2 rounded-md transition-all duration-200 group",
                          isActive
                            ? "bg-sama-100 text-sama-700"
                            : "text-gray-600 hover:bg-sama-50 hover:text-sama-600"
                        )}
                      >
                        <item.icon
                          size={20}
                          className={cn(
                            "flex-shrink-0",
                            isActive && "text-sama-600"
                          )}
                        />
                        {!collapsed && (
                          <span className="ml-3 text-sm font-medium">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-sama-100 flex items-center justify-center">
              <span className="text-sm font-medium text-sama-700">SA</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-500">admin@samamagasin.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
