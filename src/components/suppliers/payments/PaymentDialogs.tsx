
import React from "react";
import { Purchase } from "@/types/purchase";
import { PaymentDialog } from "./PaymentDialog";
import { PurchaseForm } from "../purchases/PurchaseForm";
import { PaymentHistoryDialog } from "./PaymentHistoryDialog";

interface PaymentDialogsProps {
  selectedPurchase: Purchase | null;
  isPaymentDialogOpen: boolean;
  setIsPaymentDialogOpen: (isOpen: boolean) => void;
  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;
  paymentMethod: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank';
  setPaymentMethod: (method: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank') => void;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  onPaymentSubmit: () => void;
  isPurchaseFormOpen: boolean;
  setIsPurchaseFormOpen: (isOpen: boolean) => void;
  onSavePurchase: (purchase: Purchase) => void;
  isPaymentHistoryOpen: boolean;
  setIsPaymentHistoryOpen: (isOpen: boolean) => void;
}

export const PaymentDialogs: React.FC<PaymentDialogsProps> = ({
  selectedPurchase,
  isPaymentDialogOpen,
  setIsPaymentDialogOpen,
  paymentAmount,
  setPaymentAmount,
  paymentMethod,
  setPaymentMethod,
  paymentDate,
  setPaymentDate,
  onPaymentSubmit,
  isPurchaseFormOpen,
  setIsPurchaseFormOpen,
  onSavePurchase,
  isPaymentHistoryOpen,
  setIsPaymentHistoryOpen
}) => {
  if (!selectedPurchase) return null;

  return (
    <>
      <PaymentDialog
        purchase={selectedPurchase}
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={setPaymentAmount}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        paymentDate={paymentDate}
        onPaymentDateChange={setPaymentDate}
        onSubmit={onPaymentSubmit}
      />

      <PurchaseForm
        isOpen={isPurchaseFormOpen}
        onClose={() => setIsPurchaseFormOpen(false)}
        initialPurchase={selectedPurchase}
        onSave={onSavePurchase}
      />

      <PaymentHistoryDialog
        purchase={selectedPurchase}
        open={isPaymentHistoryOpen}
        onOpenChange={setIsPaymentHistoryOpen}
      />
    </>
  );
};
