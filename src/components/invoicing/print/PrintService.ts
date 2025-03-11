
import { Invoice } from "@/services/api";
import { renderToString } from "react-dom/server";
import { InvoiceA4Template } from "./InvoiceA4Template";
import { ReceiptTemplate } from "./ReceiptTemplate";

export class PrintService {
  static printA4(invoice: Invoice | null): void {
    if (!invoice) {
      console.error("Cannot print: No invoice provided");
      return;
    }

    // Open a new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    // Render the React component to HTML
    const htmlContent = renderToString(<InvoiceA4Template invoice={invoice} />);
    
    // Write the content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);
  }

  static printReceipt(invoice: Invoice | null): void {
    if (!invoice) {
      console.error("Cannot print: No invoice provided");
      return;
    }

    // Open a new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    // Render the React component to HTML
    const htmlContent = renderToString(<ReceiptTemplate invoice={invoice} />);
    
    // Write the content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);
  }
}
