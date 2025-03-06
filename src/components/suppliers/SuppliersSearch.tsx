
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuppliersSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
}

export const SuppliersSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onRefresh 
}: SuppliersSearchProps) => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "Liste actualisée",
      description: "La liste des fournisseurs a été actualisée avec succès.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher par nom, contact ou téléphone..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      <Button 
        onClick={handleRefresh} 
        variant="outline" 
        size="sm"
        className="md:w-auto w-full transition-all hover:bg-primary hover:text-white flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" /> 
        <span>Actualiser</span>
      </Button>
    </div>
  );
};
