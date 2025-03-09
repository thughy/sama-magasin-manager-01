
import { useState } from "react";
import { Purchase } from "@/types/purchase";
import { format } from "date-fns";

export const usePaymentState = () => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank'>('cash');
  const [paymentDate, setPaymentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);

  return {
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    isPaymentHistoryOpen,
    setIsPaymentHistoryOpen,
    selectedPurchase,
    setSelectedPurchase,
    paymentAmount,
    setPaymentAmount,
    paymentMethod,
    setPaymentMethod,
    paymentDate,
    setPaymentDate,
    isPurchaseFormOpen,
    setIsPurchaseFormOpen
  };
};
