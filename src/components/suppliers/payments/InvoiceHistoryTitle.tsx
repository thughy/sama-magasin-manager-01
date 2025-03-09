
import React from "react";
import { FileText } from "lucide-react";

export const InvoiceHistoryTitle: React.FC = () => {
  return (
    <div className="mt-4 mb-4 no-break">
      <div className="flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        <h2 className="text-xl font-semibold">Historique des factures fournisseur</h2>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Liste complète des factures et de leurs statuts
      </p>
    </div>
  );
};
