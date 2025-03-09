
import React from "react";

export const PrintableFooter: React.FC = () => {
  return (
    <div className="mt-6 print-only no-break">
      <div className="border-t pt-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Document imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </p>
          <p className="text-sm text-muted-foreground page-number">
            Page <span className="current-page"></span> sur <span className="total-pages"></span>
          </p>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Ce document est un historique des factures et ne constitue pas une facture en soi.
        </p>
      </div>
    </div>
  );
};
