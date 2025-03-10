
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentJournalFiltersProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const PaymentJournalFilters: React.FC<PaymentJournalFiltersProps> = ({
  dateRange,
  setDateRange,
  onSearch,
  isLoading
}) => {
  const handleSearch = () => {
    if (dateRange.from && dateRange.to) {
      onSearch();
    }
  };

  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-2">
        <label htmlFor="date-range" className="text-sm font-medium">
          Plage de dates
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-range"
              variant={(dateRange.from || dateRange.to) ? "default" : "outline"}
              className="w-full justify-start gap-2 sm:w-auto"
            >
              <Calendar className="h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy', { locale: fr })} - {format(dateRange.to, 'dd/MM/yyyy', { locale: fr })}
                </>
              ) : dateRange.from ? (
                <>{format(dateRange.from, 'dd/MM/yyyy', { locale: fr })} - ...</>
              ) : dateRange.to ? (
                <>... - {format(dateRange.to, 'dd/MM/yyyy', { locale: fr })}</>
              ) : (
                "Sélectionner une période"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{
                from: dateRange.from,
                to: dateRange.to
              }}
              onSelect={(range) => {
                setDateRange({
                  from: range?.from,
                  to: range?.to
                });
              }}
              initialFocus
              locale={fr}
              className="p-3 pointer-events-auto"
            />
            {(dateRange.from || dateRange.to) && (
              <div className="p-2 border-t flex justify-end">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Effacer
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        onClick={handleSearch} 
        disabled={!dateRange.from || !dateRange.to || isLoading}
        className="sm:ml-2"
      >
        {isLoading ? "Chargement..." : "Rechercher"}
      </Button>
    </div>
  );
};
