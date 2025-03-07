
import React from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface DepotSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Liste des dépôts (dans une application réelle, cela viendrait d'une API ou d'un store)
const depots = [
  "Principal",
  "Secondaire",
  "Entrepôt central",
  "Magasin 1",
  "Magasin 2"
];

export const DepotSelector = ({ value, onChange }: DepotSelectorProps) => {
  return (
    <div>
      <Label htmlFor="depot">Dépôt</Label>
      <div className="relative">
        <select
          id="depot"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {depots.map((depot, index) => (
            <option key={index} value={depot}>
              {depot}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};
