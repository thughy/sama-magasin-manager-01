
import React from "react";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { PurchasesStatusFilter } from "./PurchasesStatusFilter";
import { PurchasesDateFilters } from "./PurchasesDateFilters";
import { PurchasesReferenceFilter } from "./PurchasesReferenceFilter";

interface PurchasesFiltersBarProps {
  statusFilter: "all" | "payée" | "impayée";
  setStatusFilter: (status: "all" | "payée" | "impayée") => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  dateRangeFilter: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRangeFilter: (range: { from: Date | undefined; to: Date | undefined }) => void;
  referenceFilter: string;
  setReferenceFilter: (reference: string) => void;
  resetFilters: () => void;
  resetDateFilters: () => void;
  hasActiveFilters: boolean;
}

export const PurchasesFiltersBar: React.FC<PurchasesFiltersBarProps> = ({
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  dateRangeFilter,
  setDateRangeFilter,
  referenceFilter,
  setReferenceFilter,
  resetFilters,
  resetDateFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
      <PurchasesStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      
      <PurchasesDateFilters 
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={setDateRangeFilter}
        resetDateFilters={resetDateFilters}
      />
      
      <PurchasesReferenceFilter
        referenceFilter={referenceFilter}
        setReferenceFilter={setReferenceFilter}
      />
      
      {/* Bouton pour réinitialiser tous les filtres */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="ml-auto flex items-center gap-2"
        >
          <FilterX className="h-4 w-4" /> 
          <span className="hidden sm:inline">Désactiver les filtres</span>
        </Button>
      )}
    </div>
  );
};
