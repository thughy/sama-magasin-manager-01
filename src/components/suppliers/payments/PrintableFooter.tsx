
import React from "react";

export const PrintableFooter: React.FC = () => {
  return (
    <div className="mt-6 print-only no-break">
      <div className="border-t pt-2">
        <p className="text-sm text-center text-muted-foreground">
          Document imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
        </p>
        <p className="text-sm text-center text-muted-foreground">
          Ce document est un historique des factures et ne constitue pas une facture en soi.
        </p>
      </div>
    </div>
  );
};
