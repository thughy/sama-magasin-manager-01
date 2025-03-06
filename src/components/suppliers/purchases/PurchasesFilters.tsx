
import { Input } from "@/components/ui/input";
import { Calendar, Search, X } from "lucide-react";
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

interface PurchasesFiltersProps {
  supplierSearchTerm: string;
  setSupplierSearchTerm: (term: string) => void;
  productSearchTerm: string;
  setProductSearchTerm: (term: string) => void;
  selectedDate: string | undefined;
  setSelectedDate: (date: string | undefined) => void;
  selectedStatus: "all" | "payée" | "impayée";
  setSelectedStatus: (status: "all" | "payée" | "impayée") => void;
  onClearFilters: () => void;
}

export const PurchasesFilters = ({
  supplierSearchTerm,
  setSupplierSearchTerm,
  productSearchTerm,
  setProductSearchTerm,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
  onClearFilters
}: PurchasesFiltersProps) => {
  const handleClearSupplierSearch = () => setSupplierSearchTerm("");
  const handleClearProductSearch = () => setProductSearchTerm("");
  const handleClearDate = () => setSelectedDate(undefined);
  
  // Convert string date to Date object for the Calendar component
  const dateValue = selectedDate ? new Date(selectedDate) : undefined;
  
  // Handle date selection from the Calendar component
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date ? date.toISOString().split('T')[0] : undefined);
  };
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="relative flex-grow max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un fournisseur..."
          value={supplierSearchTerm}
          onChange={(e) => setSupplierSearchTerm(e.target.value)}
          className="pl-8 pr-8"
        />
        {supplierSearchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-9 w-9 p-0" 
            onClick={handleClearSupplierSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Effacer la recherche</span>
          </Button>
        )}
      </div>
      
      <div className="relative flex-grow max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un produit..."
          value={productSearchTerm}
          onChange={(e) => setProductSearchTerm(e.target.value)}
          className="pl-8 pr-8"
        />
        {productSearchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-9 w-9 p-0" 
            onClick={handleClearProductSearch}
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
            {selectedDate ? format(new Date(selectedDate), 'dd/MM/yyyy') : "Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            locale={fr}
            className="pointer-events-auto"
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
          <SelectItem value="payée">Payée</SelectItem>
          <SelectItem value="impayée">Impayée</SelectItem>
        </SelectContent>
      </Select>
      
      {(supplierSearchTerm || productSearchTerm || selectedDate || selectedStatus !== "all") && (
        <Button variant="outline" size="icon" onClick={onClearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
