
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarNavItemWithSubItemsProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  expandedItem: string | null;
  toggleExpandItem: (title: string) => void;
  currentPath: string;
}

export function SidebarNavItemWithSubItems({ 
  item, 
  isActive, 
  collapsed, 
  expandedItem,
  toggleExpandItem,
  currentPath
}: SidebarNavItemWithSubItemsProps) {
  const isExpanded = expandedItem === item.title;

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-center w-full h-10 rounded-md transition-all duration-200",
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
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          {item.subItems?.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <Link 
                to={subItem.url}
                className="flex items-center gap-2"
              >
                <subItem.icon size={16} />
                <span>{subItem.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => toggleExpandItem(item.title)}
        className={cn(
          "flex items-center justify-between w-full h-10 px-3 py-2 rounded-md transition-all duration-200",
          isActive
            ? "bg-sama-100 text-sama-700"
            : "text-gray-600 hover:bg-sama-50 hover:text-sama-600"
        )}
      >
        <div className="flex items-center">
          <item.icon
            size={20}
            className={cn(
              "flex-shrink-0",
              isActive && "text-sama-600"
            )}
          />
          <span className="ml-3 text-sm font-medium">{item.title}</span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      
      {isExpanded && (
        <div className="pl-9 space-y-1">
          {item.subItems?.map((subItem) => (
            <Link
              key={subItem.title}
              to={subItem.url}
              className={cn(
                "flex items-center h-8 px-3 py-1 text-sm rounded-md transition-all duration-200",
                currentPath === subItem.url
                  ? "bg-sama-50 text-sama-700"
                  : "text-gray-600 hover:bg-sama-50 hover:text-sama-600"
              )}
            >
              <subItem.icon size={16} className="mr-2" />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
