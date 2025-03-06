
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const SuppliersHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos fournisseurs et suivez leurs comptes
        </p>
      </div>
      <Button className="bg-sama-500 hover:bg-sama-600">
        <Plus className="mr-2 h-4 w-4" /> Nouveau fournisseur
      </Button>
    </div>
  );
};
