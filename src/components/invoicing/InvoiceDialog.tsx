
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Invoice } from "@/services/api";
import { PrintConfirmationDialog } from "./PrintConfirmationDialog";
import { InvoiceFormContent } from "./invoice-form/InvoiceFormContent";
import { InvoiceFormFooter } from "./invoice-form/InvoiceFormFooter";
import { useInvoiceDialog } from "@/hooks/invoicing/useInvoiceDialog";
import { useInvoiceForm } from "@/hooks/invoicing/useInvoiceForm";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSave: (invoice: Partial<Invoice> & { id?: string }) => void;
}

export const InvoiceDialog = ({ open, onOpenChange, invoice, onSave }: InvoiceDialogProps) => {
  const {
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    savedInvoice,
    handleOpenChange,
    handleFormSubmit,
    handlePrintDialogClose,
    handleCloseMainDialog,
  } = useInvoiceDialog(open, onOpenChange, invoice, onSave);

  // Initialize form for validation and submission
  const { handleSubmit, items } = useInvoiceForm(invoice, handleFormSubmit);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent 
          className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden" 
          onPointerDownOutside={(e) => {
            // Always prevent closing when clicking outside
            console.log("Outside click detected, preventing default");
            e.preventDefault();
          }} 
          onEscapeKeyDown={(e) => {
            // Always prevent closing with Escape key
            console.log("Escape key detected, preventing default");
            e.preventDefault();
          }}
        >
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{invoice ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
            <DialogDescription>
              Complétez les informations pour {invoice ? "modifier" : "créer"} une facture client
            </DialogDescription>
          </DialogHeader>

          <InvoiceFormContent 
            invoice={invoice} 
            onSave={handleFormSubmit} 
          />

          <InvoiceFormFooter 
            onCancel={handleCloseMainDialog}
            onSubmit={handleSubmit}
            isSubmitDisabled={items.length === 0}
            isEditing={!!invoice}
          />
        </DialogContent>
      </Dialog>
      
      <PrintConfirmationDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        invoice={savedInvoice}
        onClose={handlePrintDialogClose}
      />
    </>
  );
};
