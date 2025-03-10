
import React, { forwardRef } from "react";
import { PrintableCompanyHeader } from "../suppliers/payments/PrintableCompanyHeader";
import { PrintableFooter } from "../suppliers/payments/PrintableFooter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Proforma } from "./ProformasTable";
import { ProformaItem } from "./proforma-items/ProformaItemsTable";

interface PrintableProformaProps {
  proforma: Proforma;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: ProformaItem[];
}

export const PrintableProforma = forwardRef<HTMLDivElement, PrintableProformaProps>(
  ({ proforma, clientName, clientEmail, clientPhone, items }, ref) => {
    const calculateTotal = () => {
      return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    };

    return (
      <div ref={ref} className="p-8 bg-white print:p-6 print:text-black print:bg-white">
        <PrintableCompanyHeader />
        
        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">FACTURE PROFORMA</h1>
          <div className="flex justify-between mt-6">
            <div>
              <p className="font-bold">Client:</p>
              <p>{clientName}</p>
              {clientEmail && <p>Email: {clientEmail}</p>}
              {clientPhone && <p>Tél: {clientPhone}</p>}
            </div>
            <div>
              <p><span className="font-bold">Référence:</span> {proforma.reference}</p>
              <p><span className="font-bold">Date:</span> {proforma.date}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article/Service</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.unitPrice.toLocaleString()} CFA</TableCell>
                  <TableCell className="text-right">
                    {(item.quantity * item.unitPrice).toLocaleString()} CFA
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end mb-8">
          <div className="w-1/3">
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{calculateTotal().toLocaleString()} CFA</span>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <p className="font-medium">Conditions:</p>
          <p>Cette facture proforma est valable pendant 15 jours à compter de la date d'émission.</p>
        </div>
        
        <PrintableFooter />
      </div>
    );
  }
);
PrintableProforma.displayName = "PrintableProforma";
