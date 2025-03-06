
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarMobileTriggerProps {
  toggleMobileSidebar: () => void;
}

export function SidebarMobileTrigger({ toggleMobileSidebar }: SidebarMobileTriggerProps) {
  return (
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
  );
}
