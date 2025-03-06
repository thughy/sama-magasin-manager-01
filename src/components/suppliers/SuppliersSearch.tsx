
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SuppliersSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const SuppliersSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onRefresh,
  statusFilter,
  onStatusFilterChange
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
    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between gap-3">
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher par nom, contact ou téléphone..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous</SelectItem>
            <SelectItem value="payée">Payée</SelectItem>
            <SelectItem value="impayée">Impayée</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="transition-all hover:bg-primary hover:text-white flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> 
          <span>Actualiser</span>
        </Button>
      </div>
    </div>
  );
};
