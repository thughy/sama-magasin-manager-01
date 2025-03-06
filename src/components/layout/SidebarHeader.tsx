
import { Store, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export function SidebarHeader({ collapsed, toggleSidebar }: SidebarHeaderProps) {
  return (
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
  );
}
