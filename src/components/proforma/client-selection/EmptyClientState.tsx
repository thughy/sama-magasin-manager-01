
import React from "react";
import { UserRound, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyClientStateProps {
  onCreateClient: () => void;
}

export function EmptyClientState({ onCreateClient }: EmptyClientStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <UserRound className="h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium">Aucun client sélectionné</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Recherchez un client existant ou créez-en un nouveau
      </p>
      <Button onClick={onCreateClient}>
        <Plus size={16} className="mr-2" />
        Créer un nouveau client
      </Button>
    </div>
  );
}
