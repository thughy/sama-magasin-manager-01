
import { Invoice } from "@/services/api";
import { renderToString } from "react-dom/server";
import { InvoiceA4Template } from "./InvoiceA4Template";
import { ReceiptTemplate } from "./ReceiptTemplate";
import { toast } from "sonner";
import React from "react";

/**
 * Service that handles printing of different document formats
 */
export class PrintService {
  /**
   * Opens a print window with the provided HTML content
   * @param htmlContent - The HTML content to print
   * @param errorMessage - Custom error message to display if printing fails
   * @returns The print window reference if successful
   */
  private static openPrintWindow(htmlContent: string, errorMessage: string = "Could not open print window"): Window | null {
    // Open a new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error(errorMessage);
      toast.error(errorMessage);
      return null;
    }

    // Write the content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    return printWindow;
  }

  /**
   * Common handler for printing operations
   * @param invoice - The invoice to print
   * @param renderTemplate - Function that renders the template
   * @param printType - Type of print for error messages
   */
  private static handlePrint(
    invoice: Invoice | null, 
    renderTemplate: (invoice: Invoice) => React.ReactElement,
    printType: string = "document"
  ): void {
    try {
      if (!invoice) {
        throw new Error(`No invoice provided`);
      }

      // Check if printing is available before proceeding
      if (!this.isPrintingAvailable()) {
        toast.error(`L'impression n'est pas disponible dans votre navigateur`);
        return;
      }

      console.log(`Preparing ${printType} for printing...`, invoice.reference);

      // Render the React component to HTML
      const htmlContent = renderToString(renderTemplate(invoice));
      
      // Open print window
      const printWindow = this.openPrintWindow(
        htmlContent, 
        `Could not open ${printType} print window`
      );
      
      if (!printWindow) return;
      
      // Wait for content to load then print
      setTimeout(() => {
        try {
          console.log(`Printing ${printType}...`);
          printWindow.print();
          printWindow.onafterprint = () => {
            console.log(`Print completed for ${printType}`);
            printWindow.close();
          };
        } catch (error) {
          console.error(`Error printing ${printType}:`, error);
          toast.error(`Unable to print ${printType}. Please try again.`);
          printWindow.close();
        }
      }, 1000); // Increased timeout to ensure content is fully loaded
    } catch (error) {
      console.error(`Error preparing ${printType} for printing:`, error);
      toast.error(`Unable to prepare ${printType} for printing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Print invoice in A4 format
   * @param invoice - The invoice to print
   */
  static printA4(invoice: Invoice | null): void {
    this.handlePrint(
      invoice, 
      (inv) => React.createElement(InvoiceA4Template, { invoice: inv }),
      "A4 invoice"
    );
  }

  /**
   * Print invoice as receipt
   * @param invoice - The invoice to print
   */
  static printReceipt(invoice: Invoice | null): void {
    this.handlePrint(
      invoice, 
      (inv) => React.createElement(ReceiptTemplate, { invoice: inv }),
      "receipt"
    );
  }

  /**
   * Check if printing is available in the current environment
   * @returns Boolean indicating if printing is available
   */
  static isPrintingAvailable(): boolean {
    return typeof window !== 'undefined' && 
           typeof window.print === 'function' && 
           typeof window.open === 'function';
  }
}
