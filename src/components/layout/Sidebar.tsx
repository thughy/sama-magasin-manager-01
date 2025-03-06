
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navItems } from "@/data/sidebarNavItems";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarNavItemWithSubItems } from "./SidebarNavItemWithSubItems";
import { SidebarMobileTrigger } from "./SidebarMobileTrigger";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleExpandItem = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    <>
      {/* Mobile menu trigger */}
      <SidebarMobileTrigger toggleMobileSidebar={toggleMobileSidebar} />

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
        <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />

        {/* Navigation items */}
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-2 space-y-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item) => {
                const isActive = !item.subItems 
                  ? location.pathname === item.href 
                  : location.pathname === item.href || 
                    (item.subItems && item.subItems.some(subItem => location.pathname === subItem.url));

                return (
                  <div key={item.title}>
                    {!item.subItems ? (
                      <SidebarNavItem 
                        item={item} 
                        isActive={isActive} 
                        collapsed={collapsed} 
                      />
                    ) : (
                      <SidebarNavItemWithSubItems 
                        item={item} 
                        isActive={isActive} 
                        collapsed={collapsed}
                        expandedItem={expandedItem}
                        toggleExpandItem={toggleExpandItem}
                        currentPath={location.pathname}
                      />
                    )}
                  </div>
                );
              })}
            </TooltipProvider>
          </nav>
        </div>

        {/* Sidebar footer */}
        <SidebarFooter collapsed={collapsed} />
      </div>
    </>
  );
}
