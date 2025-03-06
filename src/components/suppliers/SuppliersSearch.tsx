
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
        onClick={onRefresh} 
        variant="outline" 
        className="md:w-auto w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
      </Button>
    </div>
  );
};
