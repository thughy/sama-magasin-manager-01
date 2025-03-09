
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Purchase } from "@/types/purchase";

interface PaymentFormProps {
  purchase: Purchase;
  paymentAmount: number;
  onPaymentAmountChange: (amount: number) => void;
  paymentMethod: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank';
  onPaymentMethodChange: (method: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank') => void;
  paymentDate: string;
  onPaymentDateChange: (date: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  purchase,
  paymentAmount,
  onPaymentAmountChange,
  paymentMethod,
  onPaymentMethodChange,
  paymentDate,
  onPaymentDateChange
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reference" className="text-right">
          Référence
        </Label>
        <Input
          id="reference"
          value={purchase.reference}
          className="col-span-3"
          readOnly
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total" className="text-right">
          Montant Total
        </Label>
        <Input
          id="total"
          value={`${purchase.totalAmount.toLocaleString()} F CFA`}
          className="col-span-3"
          readOnly
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="balance" className="text-right">
          Solde
        </Label>
        <Input
          id="balance"
          value={`${purchase.balance.toLocaleString()} F CFA`}
          className="col-span-3"
          readOnly
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Montant à payer
        </Label>
        <Input
          id="amount"
          type="number"
          value={paymentAmount}
          onChange={(e) => onPaymentAmountChange(Number(e.target.value))}
          max={purchase.balance}
          min={0}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="method" className="text-right">
          Méthode
        </Label>
        <Select 
          value={paymentMethod} 
          onValueChange={(value) => onPaymentMethodChange(value as any)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Sélectionner une méthode de paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Espèces</SelectItem>
            <SelectItem value="wave">Wave</SelectItem>
            <SelectItem value="orangeMoney">Orange Money</SelectItem>
            <SelectItem value="cheque">Chèque</SelectItem>
            <SelectItem value="bank">Virement bancaire</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={paymentDate}
          onChange={(e) => onPaymentDateChange(e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
  );
};
