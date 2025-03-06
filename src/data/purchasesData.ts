
import { Purchase } from '@/types/purchase';

export const purchasesData: Purchase[] = [
  {
    id: "ACH001",
    reference: "F-2024-001",
    purchaseDate: "2024-04-01",
    supplierId: 1,
    supplierName: "Électronique Express",
    productName: "Smartphone X",
    quantity: 10,
    unitPrice: 150000,
    totalAmount: 1500000,
    status: 'impayée'
  },
  {
    id: "ACH002",
    reference: "F-2024-002",
    purchaseDate: "2024-03-25",
    supplierId: 2,
    supplierName: "Global Import SARL",
    productName: "Écouteurs sans fil",
    quantity: 20,
    unitPrice: 15000,
    totalAmount: 300000,
    status: 'payée'
  },
  {
    id: "ACH003",
    reference: "F-2024-003",
    purchaseDate: "2024-03-20",
    supplierId: 3,
    supplierName: "Tech Solutions",
    productName: "Chargeur USB-C",
    quantity: 50,
    unitPrice: 5000,
    totalAmount: 250000,
    status: 'payée'
  },
  {
    id: "ACH004",
    reference: "F-2024-004",
    purchaseDate: "2024-03-15",
    supplierId: 1,
    supplierName: "Électronique Express",
    productName: "Coque protection",
    quantity: 100,
    unitPrice: 2000,
    totalAmount: 200000,
    status: 'impayée'
  },
  {
    id: "ACH005",
    reference: "F-2024-005",
    purchaseDate: "2024-03-10",
    supplierId: 4,
    supplierName: "Accessoires Plus",
    productName: "Carte mémoire 128GB",
    quantity: 30,
    unitPrice: 12000,
    totalAmount: 360000,
    status: 'impayée'
  }
];
