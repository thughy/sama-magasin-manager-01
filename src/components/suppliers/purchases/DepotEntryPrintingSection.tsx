
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface DepotEntryPrintingSectionProps {
  uniqueDepots: string[];
  onPrintDepotEntry: (depot: string) => void;
}

export const DepotEntryPrintingSection = ({
  uniqueDepots,
  onPrintDepotEntry
}: DepotEntryPrintingSectionProps) => {
  if (uniqueDepots.length === 0) return null;
  
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-medium">Bons d'entrée de dépôt</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {uniqueDepots.map((depot) => (
          <Button
            key={depot}
            type="button"
            variant="outline"
            onClick={() => onPrintDepotEntry(depot)}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer bon pour {depot}</span>
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => onPrintDepotEntry('all')}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimer tous les bons</span>
        </Button>
      </div>
    </div>
  );
};
