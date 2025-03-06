
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
