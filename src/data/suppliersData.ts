
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  balance: number;
}

// Sample suppliers data
export const suppliersData: Supplier[] = [
  {
    id: 1,
    name: "Électronique Express",
    contact: "Amadou Diop",
    phone: "+221 77 123 45 67",
    email: "contact@electronique-express.sn",
    balance: 350000
  },
  {
    id: 2,
    name: "Global Import SARL",
    contact: "Fatou Ndiaye",
    phone: "+221 76 234 56 78",
    email: "info@globalimport.sn",
    balance: 125000
  },
  {
    id: 3,
    name: "Tech Solutions",
    contact: "Ibrahim Sow",
    phone: "+221 70 345 67 89",
    email: "contact@techsolutions.sn",
    balance: 0
  },
  {
    id: 4,
    name: "Accessoires Plus",
    contact: "Marie Diallo",
    phone: "+221 78 456 78 90",
    email: "ventes@accessoiresplus.sn",
    balance: 75000
  },
  {
    id: 5,
    name: "Dakar Digital",
    contact: "Jean Mendy",
    phone: "+221 77 567 89 01",
    email: "info@dakardigital.sn",
    balance: -45000
  }
];

// Stats data
export const suppliersStats = {
  pendingOrdersCount: 3,
  pendingOrdersValue: 780000,
  monthlyPaymentsTotal: 420000,
  monthlyPaymentsCount: 5,
  totalDebt: 550000,
  suppliersWithDebtCount: 3
};
