
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ItemsHeaderProps {
  onAddItem: () => void;
}

export const ItemsHeader = ({ onAddItem }: ItemsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Label>Articles</Label>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddItem}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> Ajouter
      </Button>
    </div>
  );
};
