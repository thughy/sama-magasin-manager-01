
import { useState } from "react";
import { Package, Plus, Search, Filter, MoreHorizontal, Edit, Trash, Barcode } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { useToast } from "@/hooks/use-toast";

// Types for products and services
type Product = {
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

type Service = {
  id: string;
  type: "service";
  name: string;
  amount: number;
};

type Item = Product | Service;

// Données fictives pour les produits
const initialItems: Item[] = [
  {
    id: "PRD001",
    type: "product",
    name: "Smartphone X",
    barcode: "123456789012",
    category: "Électronique",
    buyPrice: 150000,
    sellPrice: 189000,
    stock: 23,
    minStock: 5,
    depot: "Principal",
  },
  {
    id: "PRD002",
    type: "product",
    name: "Écouteurs sans fil",
    barcode: "987654321098",
    category: "Accessoires",
    buyPrice: 15000,
    sellPrice: 29000,
    stock: 5,
    minStock: 2,
    depot: "Principal",
  },
  {
    id: "PRD003",
    type: "product",
    name: "Chargeur USB-C",
    barcode: "456789123456",
    category: "Accessoires",
    buyPrice: 5000,
    sellPrice: 8500,
    stock: 42,
    minStock: 10,
    depot: "Secondaire",
  },
  {
    id: "PRD004",
    type: "product",
    name: "Coque protection",
    barcode: "789123456789",
    category: "Accessoires",
    buyPrice: 2000,
    sellPrice: 3500,
    stock: 57,
    minStock: 15,
    depot: "Principal",
  },
  {
    id: "PRD005",
    type: "product",
    name: "Carte mémoire 128GB",
    barcode: "321654987123",
    category: "Stockage",
    buyPrice: 12000,
    sellPrice: 18500,
    stock: 0,
    minStock: 3,
    depot: "Principal",
  },
  {
    id: "SRV001",
    type: "service",
    name: "Installation logiciel",
    amount: 5000,
  },
  {
    id: "SRV002",
    type: "service",
    name: "Réparation écran",
    amount: 25000,
  },
];

const Products = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredItems = items.filter(item => {
    // Filter by search term
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type === "product" && (
        (item as Product).barcode.includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Filter by category (products only)
    const matchesCategory = selectedCategory 
      ? (item.type === "product" && (item as Product).category === selectedCategory) 
      : true;
    
    // Filter by type (product or service)
    const matchesType = selectedType 
      ? item.type === selectedType
      : true;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Extract unique categories from products
  const categories = [...new Set(
    items
      .filter(item => item.type === "product")
      .map(item => (item as Product).category)
  )];

  const handleAddItem = (data: any, type: "product" | "service") => {
    // Generate a new ID
    const newId = type === "product" 
      ? `PRD${String(items.length + 1).padStart(3, '0')}` 
      : `SRV${String(items.length + 1).padStart(3, '0')}`;
    
    if (type === "product") {
      const newProduct: Product = {
        id: newId,
        type: "product",
        name: data.name,
        barcode: data.barcode,
        category: data.category,
        buyPrice: data.purchasePrice,
        sellPrice: data.sellPrice,
        stock: 0, // Initial stock
        minStock: data.minStock,
        depot: "Principal" // Default depot
      };
      setItems([...items, newProduct]);
    } else {
      const newService: Service = {
        id: newId,
        type: "service",
        name: data.name,
        amount: data.amount
      };
      setItems([...items, newService]);
    }

    toast({
      title: "Ajouté avec succès",
      description: `${type === "product" ? "Article" : "Service"} a été ajouté au catalogue.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Articles & Services</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre catalogue d'articles et de services
            </p>
          </div>
          <Button className="bg-sama-600 hover:bg-sama-700" onClick={() => setShowAddDialog(true)}>
            <Plus size={16} className="mr-2" />
            Nouvel article/service
          </Button>
        </div>

        <Card className="p-5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher par nom, code-barre..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="product">Articles</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Code-barres</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Dépôt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">
                        {item.type === "product" ? "Article" : "Service"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.type === "product" ? (
                        <div className="flex items-center">
                          <Barcode size={16} className="mr-2 text-muted-foreground" />
                          {(item as Product).barcode}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.type === "product" ? (
                        <Badge variant="outline">{(item as Product).category}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.type === "product"
                        ? `${(item as Product).sellPrice.toLocaleString()} FCFA`
                        : `${(item as Service).amount.toLocaleString()} FCFA`}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.type === "product" ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            (item as Product).stock === 0
                              ? "text-red-600 border-red-200 bg-red-50"
                              : (item as Product).stock <= (item as Product).minStock
                              ? "text-amber-600 border-amber-200 bg-amber-50"
                              : "text-green-600 border-green-200 bg-green-50"
                          )}
                        >
                          {(item as Product).stock === 0 ? "Épuisé" : (item as Product).stock}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.type === "product" ? (item as Product).depot : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit size={14} className="mr-2" /> Modifier
                          </DropdownMenuItem>
                          {item.type === "product" && (
                            <DropdownMenuItem>
                              <Package size={14} className="mr-2" /> Ajuster le stock
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash size={14} className="mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Aucun article ou service trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <AddProductDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAdd={handleAddItem} 
      />
    </MainLayout>
  );
};

export default Products;
