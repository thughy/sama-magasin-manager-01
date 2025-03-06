
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  CreditCard, 
  ShoppingCart, 
  Truck, 
  Settings,
  FileText,
  Warehouse,
  ArrowRight
} from "lucide-react";
import { NavItem } from "@/types/sidebar";

export const navItems: NavItem[] = [
  { title: "Tableau de bord", icon: LayoutDashboard, href: "/" },
  { title: "Produits", icon: Package, href: "/products" },
  { title: "Clients", icon: Users, href: "/clients" },
  { title: "Caisse", icon: CreditCard, href: "/cashier" },
  { title: "Ventes", icon: ShoppingCart, href: "/sales" },
  { 
    title: "Fournisseurs", 
    icon: Truck, 
    href: "/suppliers",
    subItems: [
      { title: "Liste des fournisseurs", url: "/suppliers", icon: Truck },
      { title: "Bon de commande", url: "/suppliers/purchase-orders", icon: FileText }
    ]
  },
  { 
    title: "Dépôts", 
    icon: Warehouse, 
    href: "/depots",
    subItems: [
      { title: "Liste des dépôts", url: "/depots", icon: Warehouse },
      { title: "Bon de sortie", url: "/depots/release-orders", icon: ArrowRight }
    ]
  },
  { title: "Paramètres", icon: Settings, href: "/settings" },
];
