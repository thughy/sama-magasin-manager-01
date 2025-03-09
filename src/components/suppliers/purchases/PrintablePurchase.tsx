
import React from "react";
import { Purchase, PurchaseItem, PaymentMethod } from "@/types/purchase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PrintablePurchaseProps {
  purchase: {
    reference: string;
    purchaseDate: string;
    supplierName: string;
    totalAmount: number;
    totalPaid: number;
    balance: number;
    status: 'payée' | 'impayée';
  };
  items: PurchaseItem[];
  paymentMethods: PaymentMethod[];
}

export const PrintablePurchase = React.forwardRef<HTMLDivElement, PrintablePurchaseProps>(
  ({ purchase, items, paymentMethods }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    return (
      <div ref={ref} className="p-8 bg-white max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Facture d'Achat</h1>
          <p className="text-gray-600">Référence: {purchase.reference}</p>
          <p className="text-gray-600">
            Date: {format(new Date(purchase.purchaseDate), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Fournisseur</h2>
          <p>{purchase.supplierName}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Articles</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Produit</th>
                <th className="border p-2 text-left">Dépôt</th>
                <th className="border p-2 text-right">Quantité</th>
                <th className="border p-2 text-right">Prix unitaire</th>
                <th className="border p-2 text-right">Prix de vente</th>
                <th className="border p-2 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2">{item.depot}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border p-2 text-right">{formatCurrency(item.sellPrice)}</td>
                  <td className="border p-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Méthodes de paiement</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Méthode</th>
                <th className="border p-2 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((method, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border p-2">
                    {method.method === 'cash' ? 'Espèces' : 
                    method.method === 'wave' ? 'Wave' : 
                    method.method === 'orangeMoney' ? 'Orange Money' : 
                    method.method === 'cheque' ? 'Chèque' : 'Banque'}
                  </td>
                  <td className="border p-2 text-right">{formatCurrency(method.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between border-t pt-4">
          <div>
            <p className="font-bold">Statut: <span className={purchase.status === 'payée' ? 'text-green-600' : 'text-red-600'}>
              {purchase.status === 'payée' ? 'Payée' : 'Impayée'}
            </span></p>
          </div>
          <div className="text-right">
            <p>Total: <span className="font-bold">{formatCurrency(purchase.totalAmount)}</span></p>
            <p>Payé: <span className="font-bold">{formatCurrency(purchase.totalPaid)}</span></p>
            <p>Solde: <span className="font-bold">{formatCurrency(purchase.balance)}</span></p>
          </div>
        </div>
      </div>
    );
  }
);

PrintablePurchase.displayName = "PrintablePurchase";
