
import { PaymentMethod } from "@/types/purchase";
import { PaymentMethodsSection } from "@/components/suppliers/purchases/PaymentMethodsSection";
import { InvoiceSummary } from "../InvoiceSummary";

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  onAddPaymentMethod: () => void;
  onRemovePaymentMethod: (id: string) => void;
  onUpdatePaymentMethod: (id: string, field: keyof PaymentMethod, value: any) => void;
}

export const PaymentSection = ({
  paymentMethods,
  totalAmount,
  amountPaid,
  balance,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onUpdatePaymentMethod
}: PaymentSectionProps) => {
  return (
    <div className="space-y-4 mt-4">
      <PaymentMethodsSection
        paymentMethods={paymentMethods}
        onAddPaymentMethod={onAddPaymentMethod}
        onRemovePaymentMethod={onRemovePaymentMethod}
        onUpdatePaymentMethod={onUpdatePaymentMethod}
      />

      <InvoiceSummary
        totalAmount={totalAmount}
        amountPaid={amountPaid}
        balance={balance}
      />
    </div>
  );
};
