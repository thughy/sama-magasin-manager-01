
import React from "react";
import { Input } from "@/components/ui/input";
import { Calendar, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PurchaseOrderFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const PurchaseOrderFilters = ({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus
}: PurchaseOrderFiltersProps) => {
  const handleClearSearch = () => setSearchTerm("");
  const handleClearDate = () => setSelectedDate(undefined);
  const handleClearStatus = () => setSelectedStatus("");
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="relative flex-grow max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un fournisseur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-8"
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-9 w-9 p-0" 
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Effacer la recherche</span>
          </Button>
        )}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant={selectedDate ? "default" : "outline"}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
          />
          {selectedDate && (
            <div className="p-2 border-t flex justify-end">
              <Button variant="ghost" size="sm" onClick={handleClearDate}>
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="delivered">Livré</SelectItem>
          <SelectItem value="cancelled">Annulé</SelectItem>
        </SelectContent>
      </Select>
      
      {(searchTerm || selectedDate || selectedStatus) && (
        <Button variant="outline" size="icon" onClick={() => {
          handleClearSearch();
          handleClearDate();
          handleClearStatus();
        }}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
