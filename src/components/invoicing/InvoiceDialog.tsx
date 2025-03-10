
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/services/api";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { PaymentMethodsSection } from "@/components/suppliers/purchases/PaymentMethodsSection";
import { useInvoiceForm } from "@/hooks/invoicing/useInvoiceForm";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceSummary } from "./InvoiceSummary";
import { FormProvider, useForm } from "react-hook-form";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSave: (invoice: Partial<Invoice> & { id?: string }) => void;
}

export const InvoiceDialog = ({ open, onOpenChange, invoice, onSave }: InvoiceDialogProps) => {
  const methods = useForm({
    defaultValues: {
      reference: invoice?.reference || "",
      date: invoice?.date || "",
      clientName: invoice?.clientName || "",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{invoice ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
          <DialogDescription>
            Complétez les informations pour {invoice ? "modifier" : "créer"} une facture client
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <InvoiceHeader
            reference={reference}
            date={date}
            clientName={clientName}
            onReferenceChange={setReference}
            onDateChange={setDate}
            onClientSelect={handleClientSelect}
          />

          <div className="space-y-4 mt-4">
            <InvoiceItemsTable 
              items={items}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onAddPaymentMethod={addPaymentMethod}
            onRemovePaymentMethod={removePaymentMethod}
            onUpdatePaymentMethod={updatePaymentMethod}
          />

          <InvoiceSummary
            totalAmount={totalAmount}
            amountPaid={amountPaid}
            balance={balance}
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={!clientId || items.length === 0}
            >
              {invoice ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
