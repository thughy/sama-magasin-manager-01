
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface PurchasesDateFiltersProps {
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  dateRangeFilter: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRangeFilter: (range: { from: Date | undefined; to: Date | undefined }) => void;
  resetDateFilters: () => void;
}

export const PurchasesDateFilters: React.FC<PurchasesDateFiltersProps> = ({
  dateFilter,
  setDateFilter,
  dateRangeFilter,
  setDateRangeFilter,
  resetDateFilters,
}) => {
  return (
    <>
      {/* Filtre pour une date spécifique */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant={dateFilter ? "default" : "outline"}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            {dateFilter 
              ? format(dateFilter, 'dd/MM/yyyy') 
              : "Date spécifique"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={dateFilter}
            onSelect={(date) => {
              setDateFilter(date);
              setDateRangeFilter({ from: undefined, to: undefined });
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
          {dateFilter && (
            <div className="p-2 border-t flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)}>
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {/* Filtre pour une plage de dates */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant={(dateRangeFilter.from || dateRangeFilter.to) ? "default" : "outline"}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            {dateRangeFilter.from && dateRangeFilter.to ? (
              <>
                {format(dateRangeFilter.from, 'dd/MM/yy')} - {format(dateRangeFilter.to, 'dd/MM/yy')}
              </>
            ) : dateRangeFilter.from ? (
              <>
                {format(dateRangeFilter.from, 'dd/MM/yy')} - ...
              </>
            ) : dateRangeFilter.to ? (
              <>
                ... - {format(dateRangeFilter.to, 'dd/MM/yy')}
              </>
            ) : "Plage de dates"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="range"
            selected={{
              from: dateRangeFilter.from,
              to: dateRangeFilter.to
            }}
            onSelect={(range) => {
              setDateRangeFilter({
                from: range?.from,
                to: range?.to
              });
              setDateFilter(undefined);
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
          {(dateRangeFilter.from || dateRangeFilter.to) && (
            <div className="p-2 border-t flex justify-end">
              <Button variant="ghost" size="sm" onClick={resetDateFilters}>
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};
