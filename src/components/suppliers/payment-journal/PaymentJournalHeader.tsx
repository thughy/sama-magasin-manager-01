
import React from "react";
import { ScrollText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentJournalHeaderProps {
  onPrint: () => void;
  canPrint: boolean;
}

export const PaymentJournalHeader: React.FC<PaymentJournalHeaderProps> = ({ 
  onPrint, 
  canPrint 
}) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <ScrollText className="h-8 w-8 text-primary" />
          Journal des paiements
        </h1>
        <p className="text-muted-foreground">
          Consultez et filtrez l'historique des paiements effectués aux fournisseurs
        </p>
      </div>
      
      <Button 
        onClick={onPrint} 
        disabled={!canPrint}
        className="print:hidden"
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};
