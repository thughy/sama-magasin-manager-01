
import React from "react";
import { Invoice } from "@/services/api";
import { PrintableCompanyHeader } from "./PrintableCompanyHeader";

interface InvoiceA4TemplateProps {
  invoice: Invoice | null;
}

export const InvoiceA4Template: React.FC<InvoiceA4TemplateProps> = ({ invoice }) => {
  if (!invoice) return null;
  
  return (
    <html>
      <head>
        <title>Facture {invoice.reference}</title>
        <style>
          {`
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
          `}
        </style>
      </head>
      <body>
        <div className="invoice-container">
          <PrintableCompanyHeader />
          
          <div className="invoice-info">
            <div>
              <h2>FACTURE</h2>
              <p><strong>N°:</strong> {invoice.reference}</p>
              <p><strong>Date:</strong> {invoice.date}</p>
            </div>
            <div className="client-info">
              <p><strong>Client:</strong> {invoice.clientName}</p>
              <p><strong>ID Client:</strong> {invoice.clientId}</p>
            </div>
          </div>
          
          <table className="invoice-table">
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
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toLocaleString()} FCFA</td>
                  <td>{item.discount}%</td>
                  <td>{item.totalPrice.toLocaleString()} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="totals">
            <div><strong>Total HT:</strong> {invoice.totalAmount.toLocaleString()} FCFA</div>
            <div><strong>Montant Payé:</strong> {invoice.amountPaid.toLocaleString()} FCFA</div>
            <div><strong>Solde:</strong> {invoice.balance.toLocaleString()} FCFA</div>
          </div>
          
          <div className="footer">
            <p>Merci pour votre confiance!</p>
            <p>Document généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </body>
    </html>
  );
};
