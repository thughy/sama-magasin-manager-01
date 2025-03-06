
export interface OrderItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  barcode?: string;
  sellPrice?: number;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  purchasePrice: number;
  sellPrice: number;
}

export interface PurchaseOrder {
  id: string;
  reference: string;
  orderDate: string;
  deliveryDate: string;
  supplierId: number;
  supplierName: string;
  status: 'pending' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdAt: string;
}
