
import React from "react";
import { Supplier } from "@/data/suppliersData";
import { OrderItem } from "@/types/purchaseOrder";

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

  return (
    <div className="hidden">
      <div ref={printRef} className="purchase-order">
        <div className="header">
          <div className="company-info">
            <h1>BON DE COMMANDE</h1>
            <p><strong>Référence:</strong> {reference}</p>
            <p><strong>Date:</strong> {orderDate}</p>
            {deliveryDate && <p><strong>Livraison souhaitée:</strong> {deliveryDate}</p>}
          </div>
        </div>
        
        <div className="supplier-info">
          <h2>Fournisseur</h2>
          <p><strong>{supplier.name}</strong></p>
          <p>Contact: {supplier.contact}</p>
          <p>Téléphone: {supplier.phone}</p>
          <p>Email: {supplier.email}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Prix unitaire (FCFA)</th>
              <th>Total (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toLocaleString()}</td>
                <td>{(item.quantity * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={3}>Total</td>
              <td>{calculateTotal().toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="footer">
          <p>Signature autorisée</p>
          <div style={{ height: '50px' }}></div>
          <p>_________________________</p>
        </div>
      </div>
    </div>
  );
};
