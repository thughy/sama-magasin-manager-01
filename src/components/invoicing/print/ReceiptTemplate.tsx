
import React from "react";
import { Invoice } from "@/services/api";
import { PrintableCompanyHeader } from "./PrintableCompanyHeader";

interface ReceiptTemplateProps {
  invoice: Invoice | null;
}

export const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ invoice }) => {
  if (!invoice) return null;
  
  return (
    <html>
      <head>
        <title>Reçu {invoice.reference}</title>
        <style>
          {`
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
          `}
        </style>
      </head>
      <body>
        <div className="receipt-container">
          <PrintableCompanyHeader />
          
          <div className="receipt-info">
            <p><strong>FACTURE N°:</strong> {invoice.reference}</p>
            <p><strong>Date:</strong> {invoice.date}</p>
            <p><strong>Client:</strong> {invoice.clientName}</p>
          </div>
          
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qté</th>
                <th>P.U</th>
                <th className="amount">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toLocaleString()}</td>
                    <td className="amount">{item.totalPrice.toLocaleString()}</td>
                  </tr>
                  {item.discount > 0 && (
                    <tr>
                      <td colSpan={3}>Remise {item.discount}%</td>
                      <td className="amount">
                        -{(item.quantity * item.unitPrice * (item.discount / 100)).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          <div className="totals">
            <div><strong>Total:</strong> {invoice.totalAmount.toLocaleString()} FCFA</div>
            <div><strong>Payé:</strong> {invoice.amountPaid.toLocaleString()} FCFA</div>
            <div><strong>Reste à payer:</strong> {invoice.balance.toLocaleString()} FCFA</div>
          </div>
          
          <div className="footer">
            <p>Merci pour votre achat!</p>
            <p>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </body>
    </html>
  );
};
