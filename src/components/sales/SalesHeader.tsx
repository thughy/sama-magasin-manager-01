
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const SalesHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ventes</h1>
        <p className="text-muted-foreground mt-1">
          Consultez et gérez vos ventes
        </p>
      </div>
      <Button className="bg-sama-600 hover:bg-sama-700">
        <ShoppingCart size={16} className="mr-2" />
        Nouvelle vente
      </Button>
    </div>
  );
};
