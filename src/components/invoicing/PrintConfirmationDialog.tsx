
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Receipt, FileText } from "lucide-react";
import { Invoice } from "@/services/api";
import { PrintService } from "./print/PrintService";

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
  const handlePrintA4 = () => {
    PrintService.printA4(invoice);
    onClose();
  };

  const handlePrintReceipt = () => {
    PrintService.printReceipt(invoice);
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Imprimer la facture</DialogTitle>
          <DialogDescription>
            Choisissez votre format d'impression pour la facture {invoice?.reference}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrintA4}
            className="flex flex-col items-center justify-center p-6 h-auto"
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
