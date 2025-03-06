
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PurchaseOrderFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

export const PurchaseOrderFilters = ({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
}: PurchaseOrderFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Rechercher par nom du fournisseur..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "dd MMMM yyyy", { locale: fr })
              ) : (
                <span>Filtrer par date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={fr}
              className={cn("p-3 pointer-events-auto")}
            />
            {selectedDate && (
              <div className="p-3 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedDate(undefined)}
                  className="w-full"
                >
                  Réinitialiser
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
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="delivered">Livré</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
