
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  balance: number;
  lastPurchase: string;
}

// Données fictives pour les clients
export const clientsData: Client[] = [
  {
    id: "CLI001",
    name: "Ibrahim Diallo",
    phone: "77 123 45 67",
    email: "ibrahim@example.com",
    type: "Régulier",
    balance: 75000,
    lastPurchase: "12/05/2023",
  },
  {
    id: "CLI002",
    name: "Fatou Diop",
    phone: "78 234 56 78",
    email: "fatou@example.com",
    type: "VIP",
    balance: 0,
    lastPurchase: "20/06/2023",
  },
  {
    id: "CLI003",
    name: "Mamadou Sow",
    phone: "76 345 67 89",
    email: "mamadou@example.com",
    type: "Occasionnel",
    balance: 12500,
    lastPurchase: "05/07/2023",
  },
  {
    id: "CLI004",
    name: "Aissatou Bah",
    phone: "70 456 78 90",
    email: "aissatou@example.com",
    type: "Régulier",
    balance: 35000,
    lastPurchase: "18/07/2023",
  },
  {
    id: "CLI005",
    name: "Ousmane Kane",
    phone: "75 567 89 01",
    email: "ousmane@example.com",
    type: "VIP",
    balance: 150000,
    lastPurchase: "02/08/2023",
  },
];
