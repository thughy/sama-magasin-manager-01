
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
  ArrowRight,
  Boxes,
  Tags,
  Layers3,
  Download
} from "lucide-react";
import { NavItem } from "@/types/sidebar";

export const navItems: NavItem[] = [
  { title: "Tableau de bord", icon: LayoutDashboard, href: "/" },
  { 
    title: "Produits", 
    icon: Package, 
    href: "/products",
    subItems: [
      { title: "Article/Service", url: "/products", icon: Package },
      { title: "Categorie", url: "/products/categories", icon: Tags }
    ]
  },
  { title: "Clients", icon: Users, href: "/clients" },
  { title: "Caisse", icon: CreditCard, href: "/cashier" },
  { title: "Ventes", icon: ShoppingCart, href: "/sales" },
  { 
    title: "Fournisseurs", 
    icon: Truck, 
    href: "/suppliers",
    subItems: [
      { title: "Liste des fournisseurs", url: "/suppliers", icon: Truck },
      { title: "Bon de commande", url: "/suppliers/purchase-orders", icon: FileText },
      { title: "Achat de marchandises", url: "/suppliers/purchases", icon: Download }
    ]
  },
  { 
    title: "Dépôts", 
    icon: Warehouse, 
    href: "/depots",
    subItems: [
      { title: "Liste des dépôts", url: "/depots", icon: Warehouse },
      { title: "Bon de sortie", url: "/depots/release-orders", icon: ArrowRight },
      { title: "Inventaire", url: "/depots/inventory", icon: Boxes }
    ]
  },
  { title: "Paramètres", icon: Settings, href: "/settings" },
];
