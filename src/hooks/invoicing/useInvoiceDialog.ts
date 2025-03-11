
import { useState, useRef, useEffect } from "react";
import { Invoice } from "@/services/api";

export const useInvoiceDialog = (
  open: boolean,
  onOpenChange: (open: boolean) => void,
  invoice: Invoice | null,
  onSave: (invoice: Partial<Invoice> & { id?: string }) => void
) => {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState<boolean>(false);
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [hasJustSaved, setHasJustSaved] = useState<boolean>(false);
  const isClosingRef = useRef(false);
  const forceKeepOpenRef = useRef(false);
  
  // Reset print dialog state when the main dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Only reset states when dialog is actually closed
      setIsPrintDialogOpen(false);
      setSavedInvoice(null);
      setHasJustSaved(false);
      isClosingRef.current = false;
      forceKeepOpenRef.current = false;
    }
  }, [open]);
  
  // Intercept the dialog close event
  const handleOpenChange = (newOpenState: boolean) => {
    console.log("Dialog open change requested:", newOpenState, "hasJustSaved:", hasJustSaved, "forceKeepOpen:", forceKeepOpenRef.current);
    
    // If trying to close the dialog and we've just saved OR print dialog is open,
    // prevent automatic closing
    if (!newOpenState) {
      if (hasJustSaved || isPrintDialogOpen || forceKeepOpenRef.current) {
        console.log("Preventing dialog from closing - hasJustSaved, printDialog open or forceKeepOpen is true");
        return;
      }
      
      // For explicit closing via cancel button
      if (isClosingRef.current) {
        console.log("Manual close requested, allowing");
        onOpenChange(false);
        isClosingRef.current = false;
        return;
      }
      
      console.log("Preventing default close behavior");
      return;
    }
    
    // For opening the dialog or when explicitly allowed to close
    onOpenChange(newOpenState);
  };

  const handleFormSubmit = (savedInvoiceData: Partial<Invoice> & { id?: string }) => {
    console.log("Invoice saved, preparing to show print dialog");
    
    // Mark that we've just saved to prevent auto-closing
    setHasJustSaved(true);
    forceKeepOpenRef.current = true;
    
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
  };

  const handlePrintDialogClose = () => {
    console.log("Closing print dialog");
    setIsPrintDialogOpen(false);
    // We specifically DON'T set hasJustSaved to false here
    // to continue preventing automatic closing
  };

  const handleCloseMainDialog = () => {
    console.log("User explicitly closed dialog");
    // Set flag to indicate an explicit close is happening
    isClosingRef.current = true;
    // Clear the just saved flag
    setHasJustSaved(false);
    forceKeepOpenRef.current = false;
    // Close the dialog
    onOpenChange(false);
  };

  return {
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    savedInvoice,
    handleOpenChange,
    handleFormSubmit,
    handlePrintDialogClose,
    handleCloseMainDialog,
  };
};
