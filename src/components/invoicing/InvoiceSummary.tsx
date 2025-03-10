
import React from "react";
import { Label } from "@/components/ui/label";

interface InvoiceSummaryProps {
  totalAmount: number;
  amountPaid: number;
  balance: number;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  totalAmount,
  amountPaid,
  balance,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div>
        <Label>Montant total</Label>
        <div className="bg-gray-100 p-2 rounded text-right font-semibold">
          {totalAmount.toLocaleString()} FCFA
        </div>
      </div>
      <div>
        <Label>Montant payé</Label>
        <div className="bg-gray-100 p-2 rounded text-right font-semibold">
          {amountPaid.toLocaleString()} FCFA
        </div>
      </div>
      <div>
        <Label>Solde</Label>
        <div className={`p-2 rounded text-right font-semibold ${balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {balance.toLocaleString()} FCFA
        </div>
      </div>
    </div>
  );
};
