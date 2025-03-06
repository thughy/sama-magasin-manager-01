
import { SaleItem } from "@/components/sales/SalesTable";

// Sample sales data
export const salesData: SaleItem[] = [
  {
    id: "VNT001",
    date: "2023-06-15",
    customer: "Client Régulier",
    paymentMethod: "Espèces",
    amount: 35000,
    status: "completed",
  },
  {
    id: "VNT002",
    date: "2023-06-14",
    customer: "Entreprise ABC",
    paymentMethod: "Virement",
    amount: 120000,
    status: "completed",
  },
  {
    id: "VNT003",
    date: "2023-06-12",
    customer: "Walk-in Customer",
    paymentMethod: "Mobile Money",
    amount: 8500,
    status: "completed",
  },
  {
    id: "VNT004",
    date: "2023-06-10",
    customer: "Société XYZ",
    paymentMethod: "Carte bancaire",
    amount: 65000,
    status: "cancelled",
  },
  {
    id: "VNT005",
    date: "2023-06-08",
    customer: "Client Premium",
    paymentMethod: "Crédit",
    amount: 95000,
    status: "pending",
  },
];
