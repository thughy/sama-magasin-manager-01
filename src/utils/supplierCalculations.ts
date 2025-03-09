
import { Purchase } from "@/types/purchase";

export const calculateSupplierBalance = (supplierId: number, purchases: Purchase[]): number => {
  const supplierPurchases = purchases.filter(p => p.supplierId === supplierId);
  return supplierPurchases.reduce((sum, purchase) => sum + purchase.balance, 0);
};

export const calculateSupplierTotalInvoice = (supplierId: number, purchases: Purchase[]): number => {
  const supplierPurchases = purchases.filter(p => p.supplierId === supplierId);
  return supplierPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
};
