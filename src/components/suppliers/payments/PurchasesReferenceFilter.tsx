
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PurchasesReferenceFilterProps {
  referenceFilter: string;
  setReferenceFilter: (reference: string) => void;
}

export const PurchasesReferenceFilter: React.FC<PurchasesReferenceFilterProps> = ({
  referenceFilter,
  setReferenceFilter,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="reference-filter" className="text-sm whitespace-nowrap">Référence:</Label>
      <Input
        id="reference-filter"
        value={referenceFilter}
        onChange={(e) => setReferenceFilter(e.target.value)}
        placeholder="Filtrer par référence"
        className="w-[180px]"
      />
    </div>
  );
};
