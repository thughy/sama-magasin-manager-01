
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PurchasesStatusFilterProps {
  statusFilter: "all" | "payée" | "impayée";
  setStatusFilter: (status: "all" | "payée" | "impayée") => void;
}

export const PurchasesStatusFilter: React.FC<PurchasesStatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">Filtrer par statut:</Label>
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as "all" | "payée" | "impayée")}
      >
        <SelectTrigger id="status-filter" className="w-[180px]">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="payée">Payées</SelectItem>
          <SelectItem value="impayée">Impayées</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
