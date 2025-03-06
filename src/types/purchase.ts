
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
  status: 'payée' | 'impayée';
}
