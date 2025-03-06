
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
}
