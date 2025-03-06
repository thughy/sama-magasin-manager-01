
import React from "react";
import { Supplier } from "@/data/suppliersData";
import { OrderItem } from "@/types/purchaseOrder";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

interface PrintablePurchaseOrderProps {
  supplier: Supplier;
  reference: string;
  orderDate: string;
  deliveryDate: string;
  orderItems: OrderItem[];
  printRef: React.RefObject<HTMLDivElement>;
}

export const PrintablePurchaseOrder = ({ 
  supplier, 
  reference, 
  orderDate, 
  deliveryDate, 
  orderItems,
  printRef 
}: PrintablePurchaseOrderProps) => {
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // Company info - this would typically come from a settings store or API
  const companyInfo = {
    name: "SAMA MAGASIN",
    address: "123 Rue Principale, Dakar",
    phone: "+221 77 123 45 67",
    email: "contact@samamagasin.com",
    taxId: "SN12345678",
    logo: localStorage.getItem('companyLogo') || "" // Get logo from localStorage if available
  };

  return (
    <div className="hidden">
      <div ref={printRef} className="purchase-order">
        <div className="header">
          <div className="company-info">
            {companyInfo.logo && (
              <div className="mb-2">
                <img src={companyInfo.logo} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
            <h1 className="text-xl font-bold">{companyInfo.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={14} />
              <p>{companyInfo.address}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Phone size={14} />
              <p>{companyInfo.phone}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Mail size={14} />
              <p>{companyInfo.email}</p>
            </div>
            <p className="mt-1"><strong>NINEA:</strong> {companyInfo.taxId}</p>
          </div>
          
          <div className="order-details">
            <h1 className="text-xl font-bold">BON DE COMMANDE</h1>
            <p><strong>Référence:</strong> {reference}</p>
            <p><strong>Date:</strong> {orderDate}</p>
            {deliveryDate && <p><strong>Livraison souhaitée:</strong> {deliveryDate}</p>}
          </div>
        </div>
        
        <div className="supplier-info mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Fournisseur</h2>
          <p><strong>{supplier.name}</strong></p>
          <p>Contact: {supplier.contact}</p>
          <p>Téléphone: {supplier.phone}</p>
          <p>Email: {supplier.email}</p>
        </div>
        
        <table className="mt-6 w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-center">Quantité</th>
              <th className="border p-2 text-right">Prix unitaire (FCFA)</th>
              <th className="border p-2 text-right">Total (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-right">{item.unitPrice.toLocaleString()}</td>
                <td className="border p-2 text-right">{(item.quantity * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={3} className="border p-2 text-right font-bold">Total</td>
              <td className="border p-2 text-right font-bold">{calculateTotal().toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="footer mt-12">
          <p>Signature autorisée</p>
          <div className="h-12"></div>
          <p>_________________________</p>
        </div>
      </div>
    </div>
  );
};
