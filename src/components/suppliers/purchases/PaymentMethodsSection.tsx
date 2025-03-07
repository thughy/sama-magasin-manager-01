
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { PaymentMethod } from "@/types/purchase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: () => void;
  onRemovePaymentMethod: (id: string) => void;
  onUpdatePaymentMethod: (id: string, field: keyof PaymentMethod, value: any) => void;
}

export const PaymentMethodsSection = ({
  paymentMethods,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onUpdatePaymentMethod
}: PaymentMethodsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Paiements</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddPaymentMethod}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Ajouter un paiement
        </Button>
      </div>
      
      {paymentMethods.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">Aucun paiement ajouté.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((payment) => (
            <div key={payment.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end p-3 border rounded-md bg-gray-50">
              <div>
                <Label htmlFor={`payment-method-${payment.id}`}>Méthode</Label>
                <Select
                  value={payment.method}
                  onValueChange={(value) => onUpdatePaymentMethod(payment.id, 'method', value)}
                >
                  <SelectTrigger id={`payment-method-${payment.id}`}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="wave">Wave</SelectItem>
                    <SelectItem value="orangeMoney">Orange Money</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="bank">Banque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`payment-amount-${payment.id}`}>Montant (FCFA)</Label>
                <Input
                  id={`payment-amount-${payment.id}`}
                  type="number"
                  value={payment.amount}
                  onChange={(e) => onUpdatePaymentMethod(payment.id, 'amount', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemovePaymentMethod(payment.id)}
                  className="h-9 w-9 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
