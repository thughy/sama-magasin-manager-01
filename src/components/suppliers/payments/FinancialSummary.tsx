
import React from "react";
import { Purchase } from "@/types/purchase";

interface FinancialSummaryProps {
  purchases: Purchase[];
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ purchases }) => {
  if (!purchases || purchases.length === 0) return null;
  
  return (
    <div className="mt-8 print-only">
      <h3 className="text-lg font-semibold mb-2">Récapitulatif financier</h3>
      <div className="border p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Total des factures:</p>
            <p className="text-lg font-bold">
              {purchases.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()} F CFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Montant payé:</p>
            <p className="text-lg font-bold">
              {purchases.reduce((sum, p) => sum + p.totalPaid, 0).toLocaleString()} F CFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Solde restant:</p>
            <p className="text-lg font-bold">
              {purchases.reduce((sum, p) => sum + p.balance, 0).toLocaleString()} F CFA
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Nombre de factures:</p>
            <p className="text-lg font-bold">{purchases.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
