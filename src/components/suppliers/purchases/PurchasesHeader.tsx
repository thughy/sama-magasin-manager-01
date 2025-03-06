
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchasesHeaderProps {
  onAddNew: () => void;
  onRefresh: () => void;
}

export const PurchasesHeader = ({ onAddNew, onRefresh }: PurchasesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achat de marchandises</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos achats et leurs statuts de paiement
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw size={16} />
          Actualiser
        </Button>
        <Button className="bg-sama-600 hover:bg-sama-700" onClick={onAddNew}>
          <Plus size={16} className="mr-2" />
          Nouvel achat
        </Button>
      </div>
    </div>
  );
};
