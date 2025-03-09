
export interface PaymentMethod {
  id: string;
  method: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank';
  amount: number;
  date?: string; // Add date field for payment history
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  sellPrice: number;
  depot: string;
}

export interface Purchase {
  id: string;
  reference: string;
  purchaseDate: string;
  supplierId: number;
  supplierName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  totalPaid: number;
  balance: number;
  status: 'payée' | 'impayée';
  paymentMethods?: PaymentMethod[];
  items?: PurchaseItem[];
}
