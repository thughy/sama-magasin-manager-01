
export type Product = {
  id: string;
  type: "product";
  name: string;
  barcode: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  depot: string;
};

export type Service = {
  id: string;
  type: "service";
  name: string;
  amount: number;
};

export type Item = Product | Service;
