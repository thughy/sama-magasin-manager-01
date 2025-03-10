
import React from "react";
import { ScrollText } from "lucide-react";

export const PaymentJournalHeader: React.FC = () => {
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
    </div>
  );
};
