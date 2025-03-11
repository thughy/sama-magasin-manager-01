
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/services/api";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { PaymentMethodsSection } from "@/components/suppliers/purchases/PaymentMethodsSection";
import { useInvoiceForm, DEFAULT_CLIENT } from "@/hooks/invoicing/useInvoiceForm";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceSummary } from "./InvoiceSummary";
import { FormProvider, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { PrintConfirmationDialog } from "./PrintConfirmationDialog";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSave: (invoice: Partial<Invoice> & { id?: string }) => void;
}

export const InvoiceDialog = ({ open, onOpenChange, invoice, onSave }: InvoiceDialogProps) => {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState<boolean>(false);
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [hasJustSaved, setHasJustSaved] = useState<boolean>(false);
  const isClosingRef = useRef(false);
  
  // Reset print dialog state when the main dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Only reset states when dialog is actually closed
      setIsPrintDialogOpen(false);
      setSavedInvoice(null);
      setHasJustSaved(false);
      isClosingRef.current = false;
    }
  }, [open]);
  
  // Intercept the dialog close event
  const handleOpenChange = (newOpenState: boolean) => {
    console.log("Dialog open change requested:", newOpenState, "hasJustSaved:", hasJustSaved);
    
    // If trying to close the dialog and we've just saved OR print dialog is open,
    // prevent automatic closing
    if (!newOpenState && (hasJustSaved || isPrintDialogOpen)) {
      console.log("Preventing dialog from closing - just saved or print dialog open");
      return;
    }
    
    // For explicit closing via cancel button
    if (!newOpenState && isClosingRef.current) {
      console.log("Manual close requested, allowing");
      onOpenChange(false);
      isClosingRef.current = false;
      return;
    }
    
    // For opening the dialog or when explicitly allowed to close
    onOpenChange(newOpenState);
  };
  
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
  } = useInvoiceForm(invoice, (savedInvoiceData) => {
    console.log("Invoice saved, preparing to show print dialog");
    
    // Mark that we've just saved to prevent auto-closing
    setHasJustSaved(true);
    
    // Make sure we have a valid invoice object with an ID for the print dialog
    const invoiceWithId = {
      ...savedInvoiceData,
      id: savedInvoiceData.id || `invoice-${Date.now()}`,
    } as Invoice;
    
    // Store saved invoice data
    setSavedInvoice(invoiceWithId);
    
    // Save to database
    onSave(savedInvoiceData);
    
    // Show print dialog with a small delay
    setTimeout(() => {
      console.log("Opening print dialog now");
      setIsPrintDialogOpen(true);
    }, 100);
  });

  const handlePrintDialogClose = () => {
    console.log("Closing print dialog");
    setIsPrintDialogOpen(false);
    // We don't automatically close the main dialog anymore
  };

  const handleCloseMainDialog = () => {
    console.log("User explicitly closed dialog");
    // Set flag to indicate an explicit close is happening
    isClosingRef.current = true;
    // Clear the just saved flag
    setHasJustSaved(false);
    // Close the dialog
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden" onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside if we've just saved
          if (hasJustSaved || isPrintDialogOpen) {
            e.preventDefault();
          }
        }} onEscapeKeyDown={(e) => {
          // Prevent closing with Escape key if we've just saved
          if (hasJustSaved || isPrintDialogOpen) {
            e.preventDefault();
          }
        }}>
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{invoice ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
            <DialogDescription>
              Complétez les informations pour {invoice ? "modifier" : "créer"} une facture client
            </DialogDescription>
          </DialogHeader>

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
            </FormProvider>
          </div>

          <div className="p-6 border-t flex justify-between items-center mt-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCloseMainDialog}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={items.length === 0}
            >
              {invoice ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Toujours rendre le composant de dialogue d'impression, mais contrôler la visibilité avec la prop 'open' */}
      <PrintConfirmationDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        invoice={savedInvoice}
        onClose={handlePrintDialogClose}
      />
    </>
  );
};
