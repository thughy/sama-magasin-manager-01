
import React from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string; // Added className prop
}

// Liste des dépôts (dans une application réelle, cela viendrait d'une API ou d'un store)
const depots = [
  { id: "", name: "Sélectionnez un dépôt" },
  { id: "Principal", name: "Principal" },
  { id: "Secondaire", name: "Secondaire" },
  { id: "Entrepôt central", name: "Entrepôt central" },
  { id: "Magasin 1", name: "Magasin 1" },
  { id: "Magasin 2", name: "Magasin 2" }
];

export const DepotSelector = ({ value, onChange, className }: DepotSelectorProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <select
          id="depot"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm appearance-none"
          value={value}
          onChange={(e) => {
            console.log("Selected depot value:", e.target.value);
            onChange(e.target.value);
          }}
          required
          style={{ width: "120%" }} // Increased width by 20%
        >
          {depots.map((depot) => (
            <option 
              key={depot.id} 
              value={depot.id}
              disabled={depot.id === ""}
            >
              {depot.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};
