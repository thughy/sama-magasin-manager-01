
import { FormProvider, useForm } from "react-hook-form";
import { Invoice } from "@/services/api";
import { InvoiceHeader } from "../InvoiceHeader";
import { useInvoiceForm, DEFAULT_CLIENT } from "@/hooks/invoicing/useInvoiceForm";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { PaymentSection } from "./PaymentSection";

interface InvoiceFormContentProps {
  invoice: Invoice | null;
  onSave: (savedInvoiceData: Partial<Invoice> & { id?: string }) => void;
}

export const InvoiceFormContent = ({ invoice, onSave }: InvoiceFormContentProps) => {
  const methods = useForm({
    defaultValues: {
      reference: invoice?.reference || "",
      date: invoice?.date || "",
      clientName: invoice?.clientName || DEFAULT_CLIENT.name,
    }
  });
  
  const {
    reference,
    setReference,
    date,
    setDate,
    clientId,
    clientName,
    items,
    totalAmount,
    amountPaid,
    balance,
    paymentMethods,
    handleClientSelect,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    handleSubmit,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod
  } = useInvoiceForm(invoice, onSave);

  return (
    <div className="flex-1 overflow-y-auto px-6">
      <FormProvider {...methods}>
        <InvoiceHeader
          reference={reference}
          date={date}
          clientName={clientName}
          onReferenceChange={setReference}
          onDateChange={setDate}
          onClientSelect={handleClientSelect}
        />

        <InvoiceItemsSection 
          items={items}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
        />

        <PaymentSection 
          paymentMethods={paymentMethods}
          totalAmount={totalAmount}
          amountPaid={amountPaid}
          balance={balance}
          onAddPaymentMethod={addPaymentMethod}
          onRemovePaymentMethod={removePaymentMethod}
          onUpdatePaymentMethod={updatePaymentMethod}
        />
      </FormProvider>
    </div>
  );
};
