
import { Purchase } from "@/types/purchase";

/**
 * Calculate the current balance for a specific supplier
 * @param supplierId The ID of the supplier
 * @param purchases Array of all purchases
 * @returns The calculated balance or 0 if no purchases exist
 */
export const calculateSupplierBalance = (supplierId: number, purchases: Purchase[]): number => {
  // Added additional null check with optional chaining and nullish coalescing
  const validPurchases = purchases?.filter(p => p?.supplierId === supplierId) ?? [];
  
  // Handle empty array case explicitly
  if (validPurchases.length === 0) {
    console.info(`No purchases found for supplier ID ${supplierId}`);
    return 0;
  }
  
  // Use reduce with more defensive coding
  return validPurchases.reduce((sum, purchase) => {
    const balance = typeof purchase.balance === 'number' ? purchase.balance : 0;
    return sum + balance;
  }, 0);
};

/**
 * Calculate the total invoice amount for a specific supplier
 * @param supplierId The ID of the supplier
 * @param purchases Array of all purchases
 * @returns The calculated total invoice amount or 0 if no purchases exist
 */
export const calculateSupplierTotalInvoice = (supplierId: number, purchases: Purchase[]): number => {
  // Added additional null check with optional chaining and nullish coalescing
  const validPurchases = purchases?.filter(p => p?.supplierId === supplierId) ?? [];
  
  // Handle empty array case explicitly
  if (validPurchases.length === 0) {
    console.info(`No purchases found for supplier ID ${supplierId} for total invoice calculation`);
    return 0;
  }
  
  // Use reduce with more defensive coding
  return validPurchases.reduce((sum, purchase) => {
    const totalAmount = typeof purchase.totalAmount === 'number' ? purchase.totalAmount : 0;
    return sum + totalAmount;
  }, 0);
};

/**
 * Calculate the total paid amount for a specific supplier
 * @param supplierId The ID of the supplier
 * @param purchases Array of all purchases
 * @returns The calculated total paid amount or 0 if no purchases exist
 */
export const calculateSupplierTotalPaid = (supplierId: number, purchases: Purchase[]): number => {
  // Calculate total invoice amount
  const totalInvoice = calculateSupplierTotalInvoice(supplierId, purchases);
  
  // Calculate current balance
  const currentBalance = calculateSupplierBalance(supplierId, purchases);
  
  // Total paid is the difference between total invoice and current balance
  return totalInvoice - currentBalance;
};
