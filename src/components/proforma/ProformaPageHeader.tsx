
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ProformaPageHeaderProps {
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export const ProformaPageHeader: React.FC<ProformaPageHeaderProps> = ({ 
  isLoading, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proforma</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos documents proforma pour vos clients
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="flex items-center"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
    </div>
  );
};
