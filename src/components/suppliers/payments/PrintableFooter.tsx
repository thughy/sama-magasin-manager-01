
import React, { useEffect } from "react";

export const PrintableFooter: React.FC = () => {
  // Set up page numbering when the component mounts
  useEffect(() => {
    const handleBeforePrint = () => {
      // Reset the counters before printing
      let pageNum = 0;
      const totalPages = document.querySelectorAll('.page-break').length + 1;
      
      // Update all current-page elements
      document.querySelectorAll('.current-page').forEach(el => {
        pageNum++;
        el.textContent = pageNum.toString();
      });
      
      // Update all total-pages elements
      document.querySelectorAll('.total-pages').forEach(el => {
        el.textContent = totalPages.toString();
      });
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);

  return (
    <div className="mt-6 print-only no-break">
      <div className="border-t pt-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Document imprimé le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </p>
          <p className="text-sm text-muted-foreground page-number">
            Page <span className="current-page">1</span> sur <span className="total-pages">1</span>
          </p>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Ce document est un historique des factures et ne constitue pas une facture en soi.
        </p>
      </div>
    </div>
  );
};
