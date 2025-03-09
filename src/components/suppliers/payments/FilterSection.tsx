
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface FilterSectionProps {
  referenceFilter: string;
  setReferenceFilter: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  totalMinFilter: string;
  setTotalMinFilter: (value: string) => void;
  totalMaxFilter: string;
  setTotalMaxFilter: (value: string) => void;
  paidMinFilter: string;
  setPaidMinFilter: (value: string) => void;
  paidMaxFilter: string;
  setPaidMaxFilter: (value: string) => void;
  statusFilter: "all" | "payée" | "impayée";
  setStatusFilter: (value: "all" | "payée" | "impayée") => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  referenceFilter,
  setReferenceFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  totalMinFilter,
  setTotalMinFilter,
  totalMaxFilter,
  setTotalMaxFilter,
  paidMinFilter,
  setPaidMinFilter,
  paidMaxFilter,
  setPaidMaxFilter,
  statusFilter,
  setStatusFilter
}) => {
  const resetFilters = () => {
    setReferenceFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
    setTotalMinFilter("");
    setTotalMaxFilter("");
    setPaidMinFilter("");
    setPaidMaxFilter("");
    setStatusFilter("all");
  };

  return (
    <div className="border rounded-md p-3 mb-4 bg-muted/20">
      <h3 className="text-sm font-medium mb-2">Filtres</h3>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 items-center gap-2">
          <Label htmlFor="reference-filter" className="text-xs">
            Référence
          </Label>
          <Input
            id="reference-filter"
            placeholder="Filtrer par référence"
            value={referenceFilter}
            onChange={(e) => setReferenceFilter(e.target.value)}
            className="h-8"
          />
        </div>

        <div className="grid grid-cols-1 items-center gap-2">
          <Label className="text-xs">Période</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal h-8",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-3 w-3" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Date début"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal h-8",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-3 w-3" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Date fin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="total-min" className="text-xs">
              Total Min (FCFA)
            </Label>
            <Input
              id="total-min"
              type="number"
              placeholder="Min"
              value={totalMinFilter}
              onChange={(e) => setTotalMinFilter(e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="total-max" className="text-xs">
              Total Max (FCFA)
            </Label>
            <Input
              id="total-max"
              type="number"
              placeholder="Max"
              value={totalMaxFilter}
              onChange={(e) => setTotalMaxFilter(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="paid-min" className="text-xs">
              Versé Min (FCFA)
            </Label>
            <Input
              id="paid-min"
              type="number"
              placeholder="Min"
              value={paidMinFilter}
              onChange={(e) => setPaidMinFilter(e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="paid-max" className="text-xs">
              Versé Max (FCFA)
            </Label>
            <Input
              id="paid-max"
              type="number"
              placeholder="Max"
              value={paidMaxFilter}
              onChange={(e) => setPaidMaxFilter(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status-filter" className="text-xs">
            Statut
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as any)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="payée">Payée</SelectItem>
              <SelectItem value="impayée">Impayée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};
