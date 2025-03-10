
import { Button } from "@/components/ui/button";
import { Receipt, Plus } from "lucide-react";

interface EmptyInvoiceStateProps {
  onNewInvoice: () => void;
}

export const EmptyInvoiceState = ({ onNewInvoice }: EmptyInvoiceStateProps) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 gap-4">
      <Receipt className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Module de facturation</h3>
      <p className="text-muted-foreground max-w-md">
        Ce module vous permet de créer et gérer les factures clients, de suivre les paiements et de générer des rapports.
      </p>
      <Button className="mt-2" onClick={onNewInvoice}>
        <Plus className="h-4 w-4 mr-2" />
        Créer une facture
      </Button>
    </div>
  );
};
