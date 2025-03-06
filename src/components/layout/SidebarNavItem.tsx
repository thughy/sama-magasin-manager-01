
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

export function SidebarNavItem({ item, isActive, collapsed }: SidebarNavItemProps) {
  return (
    <Tooltip>
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
}
