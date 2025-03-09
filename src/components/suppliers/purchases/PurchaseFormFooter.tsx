
import React from "react";
import { Button } from "@/components/ui/button";
import { PackageCheck } from "lucide-react";
import { Purchase } from "@/types/purchase";

interface PurchaseFormFooterProps {
  formData: Pick<Purchase, 'totalAmount' | 'totalPaid' | 'balance'>;
  isValid: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PurchaseFormFooter = ({
  formData,
  isValid,
  isEditing,
  onCancel,
  onSubmit
}: PurchaseFormFooterProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="space-y-1">
        <div className="text-sm">Total facture: <span className="font-bold">{formatCurrency(formData.totalAmount)}</span></div>
        <div className="text-sm">Total versé: <span className="font-bold">{formatCurrency(formData.totalPaid)}</span></div>
        <div className="text-sm">Solde restant: <span className="font-bold">{formatCurrency(formData.balance)}</span></div>
      </div>
      
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Fermer
        </Button>
        <Button 
          type="submit" 
          disabled={!isValid} 
          className="bg-sama-600 hover:bg-sama-700 flex items-center gap-2"
        >
          <PackageCheck className="h-4 w-4" />
          {isEditing ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
};
