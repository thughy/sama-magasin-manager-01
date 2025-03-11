
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Receipt, FileText } from "lucide-react";
import { Invoice } from "@/services/api";

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
    // Prepare A4 print view
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    // Setup print styling and content for A4
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${invoice?.reference}</title>
          <style>
            @page {
              size: A4;
              margin: 1.5cm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .invoice-container {
              max-width: 100%;
              margin: 0 auto;
            }
            .company-header {
              text-align: center;
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .company-header h1 {
              font-size: 24px;
              margin: 5px 0;
            }
            .company-header p {
              margin: 5px 0;
              font-size: 12px;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .invoice-info div {
              flex: 1;
            }
            .client-info {
              margin-bottom: 20px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .invoice-table th {
              background-color: #f8f8f8;
            }
            .totals {
              margin-top: 20px;
              text-align: right;
            }
            .totals div {
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #777;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="company-header">
              <h1>ENTREPRISE XYZ</h1>
              <p>123 Rue du Commerce, Dakar, Sénégal</p>
              <p>Tel: +221 33 123 45 67 | Email: contact@entreprise-xyz.sn</p>
              <p>NINEA: 123456789 | RC: SN-DKR-2020-B-12345</p>
            </div>
            
            <div class="invoice-info">
              <div>
                <h2>FACTURE</h2>
                <p><strong>N°:</strong> ${invoice?.reference}</p>
                <p><strong>Date:</strong> ${invoice?.date}</p>
              </div>
              <div class="client-info">
                <p><strong>Client:</strong> ${invoice?.clientName}</p>
                <p><strong>ID Client:</strong> ${invoice?.clientId}</p>
              </div>
            </div>
            
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Remise</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice?.items.map(item => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toLocaleString()} FCFA</td>
                    <td>${item.discount}%</td>
                    <td>${item.totalPrice.toLocaleString()} FCFA</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>
            
            <div class="totals">
              <div><strong>Total HT:</strong> ${invoice?.totalAmount.toLocaleString()} FCFA</div>
              <div><strong>Montant Payé:</strong> ${invoice?.amountPaid.toLocaleString()} FCFA</div>
              <div><strong>Solde:</strong> ${invoice?.balance.toLocaleString()} FCFA</div>
            </div>
            
            <div class="footer">
              <p>Merci pour votre confiance!</p>
              <p>Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        onClose();
      };
    }, 500);
  };

  const handlePrintReceipt = () => {
    // Prepare receipt print view (80mm width)
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    // Setup print styling and content for receipt (80mm)
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu ${invoice?.reference}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 5mm;
            }
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 0;
              width: 70mm;
              font-size: 10pt;
            }
            .receipt-container {
              width: 100%;
            }
            .company-header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 5mm;
              margin-bottom: 5mm;
            }
            .company-header h1 {
              font-size: 12pt;
              margin: 2mm 0;
            }
            .company-header p {
              margin: 1mm 0;
              font-size: 8pt;
            }
            .receipt-info {
              margin-bottom: 5mm;
              font-size: 9pt;
            }
            .receipt-info p {
              margin: 1mm 0;
            }
            .receipt-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 5mm;
              font-size: 8pt;
            }
            .receipt-table th, .receipt-table td {
              border-bottom: 1px dashed #ccc;
              padding: 1mm 0;
              text-align: left;
            }
            .receipt-table .amount {
              text-align: right;
            }
            .totals {
              margin-top: 3mm;
              text-align: right;
              font-size: 9pt;
            }
            .totals div {
              margin-bottom: 1mm;
            }
            .footer {
              margin-top: 10mm;
              text-align: center;
              font-size: 8pt;
              border-top: 1px dashed #000;
              padding-top: 3mm;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="company-header">
              <h1>ENTREPRISE XYZ</h1>
              <p>123 Rue du Commerce, Dakar, Sénégal</p>
              <p>Tel: +221 33 123 45 67</p>
              <p>NINEA: 123456789</p>
            </div>
            
            <div class="receipt-info">
              <p><strong>FACTURE N°:</strong> ${invoice?.reference}</p>
              <p><strong>Date:</strong> ${invoice?.date}</p>
              <p><strong>Client:</strong> ${invoice?.clientName}</p>
            </div>
            
            <table class="receipt-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qté</th>
                  <th>P.U</th>
                  <th class="amount">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice?.items.map(item => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toLocaleString()}</td>
                    <td class="amount">${item.totalPrice.toLocaleString()}</td>
                  </tr>
                  ${item.discount > 0 ? `
                  <tr>
                    <td colspan="3">Remise ${item.discount}%</td>
                    <td class="amount">-${(item.quantity * item.unitPrice * (item.discount / 100)).toLocaleString()}</td>
                  </tr>
                  ` : ''}
                `).join('') || ''}
              </tbody>
            </table>
            
            <div class="totals">
              <div><strong>Total:</strong> ${invoice?.totalAmount.toLocaleString()} FCFA</div>
              <div><strong>Payé:</strong> ${invoice?.amountPaid.toLocaleString()} FCFA</div>
              <div><strong>Reste à payer:</strong> ${invoice?.balance.toLocaleString()} FCFA</div>
            </div>
            
            <div class="footer">
              <p>Merci pour votre achat!</p>
              <p>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        onClose();
      };
    }, 500);
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
