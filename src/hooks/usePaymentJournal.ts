
import { useState, useEffect, useCallback } from "react";
import { Purchase, PaymentMethod } from "@/types/purchase";

interface PaymentItem {
  id: string;
  date: string;
  amount: number;
  method: string;
  supplierName: string;
  invoiceReference: string;
  purchaseId: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const usePaymentJournal = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchPayments = useCallback(() => {
    if (!dateRange.from || !dateRange.to) {
      return;
    }

    setIsLoading(true);

    try {
      // Get purchases from localStorage
      const purchasesData = localStorage.getItem("purchases");
      if (!purchasesData) {
        setPayments([]);
        setTotalAmount(0);
        setIsLoading(false);
        return;
      }

      const purchases: Purchase[] = JSON.parse(purchasesData);
      const allPayments: PaymentItem[] = [];

      // Extract payment methods from each purchase
      purchases.forEach(purchase => {
        if (purchase.paymentMethods && purchase.paymentMethods.length > 0) {
          purchase.paymentMethods.forEach(payment => {
            // Convert payment date to Date object for comparison
            const paymentDate = new Date(payment.date);
            
            // Only include payments within the selected date range
            if (
              paymentDate >= dateRange.from! && 
              paymentDate <= dateRange.to!
            ) {
              allPayments.push({
                id: payment.id,
                date: payment.date,
                amount: payment.amount,
                method: payment.method,
                supplierName: purchase.supplierName,
                invoiceReference: purchase.reference,
                purchaseId: purchase.id
              });
            }
          });
        }
      });

      // Sort payments by date, most recent first
      allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Calculate total amount
      const total = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

      setPayments(allPayments);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchPayments();
    }
  }, [dateRange, fetchPayments]);

  return {
    payments,
    dateRange,
    setDateRange,
    isLoading,
    fetchPayments,
    totalAmount
  };
};
