
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Receipt, FileText } from "lucide-react";
import { Invoice } from "@/services/api";
import { PrintService } from "./print/PrintService";
import { toast } from "sonner";

interface PrintConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onClose: () => void;
}

export const PrintConfirmationDialog = ({
  open,
  onOpenChange,
  invoice,
  onClose,
}: PrintConfirmationDialogProps) => {
  // Vérifier si l'impression est disponible
  const isPrintingAvailable = PrintService.isPrintingAvailable();

  const handlePrintA4 = () => {
    console.log("Printing A4 format", invoice);
    if (invoice) {
      PrintService.printA4(invoice);
      toast.success("Impression A4 en cours");
    } else {
      toast.error("Aucune facture à imprimer");
    }
    onClose();
  };

  const handlePrintReceipt = () => {
    console.log("Printing receipt format", invoice);
    if (invoice) {
      PrintService.printReceipt(invoice);
      toast.success("Impression du ticket en cours");
    } else {
      toast.error("Aucune facture à imprimer");
    }
    onClose();
  };

  const handleSkip = () => {
    console.log("Skipping print");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Imprimer la facture</DialogTitle>
          <DialogDescription>
            Choisissez votre format d'impression pour la facture {invoice?.reference}
            {!isPrintingAvailable && (
              <p className="text-red-500 mt-2">
                L'impression n'est pas disponible dans ce navigateur.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrintA4}
            className="flex flex-col items-center justify-center p-6 h-auto"
            disabled={!isPrintingAvailable}
          >
            <FileText className="h-16 w-16 mb-2" />
            <span className="text-lg">Format A4</span>
            <span className="text-xs text-muted-foreground mt-1">Papier standard</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrintReceipt}
            className="flex flex-col items-center justify-center p-6 h-auto"
            disabled={!isPrintingAvailable}
          >
            <Receipt className="h-16 w-16 mb-2" />
            <span className="text-lg">Ticket de caisse</span>
            <span className="text-xs text-muted-foreground mt-1">Format 80mm</span>
          </Button>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="secondary" onClick={handleSkip} className="w-full">
            Ignorer l'impression
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
