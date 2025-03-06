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

// Données fictives pour les produits
const products = [
  {
    id: "PRD001",
    name: "Smartphone X",
    barcode: "123456789012",
    category: "Électronique",
    buyPrice: 150000,
    sellPrice: 189000,
    stock: 23,
    depot: "Principal",
  },
  {
    id: "PRD002",
    name: "Écouteurs sans fil",
    barcode: "987654321098",
    category: "Accessoires",
    buyPrice: 15000,
    sellPrice: 29000,
    stock: 5,
    depot: "Principal",
  },
  {
    id: "PRD003",
    name: "Chargeur USB-C",
    barcode: "456789123456",
    category: "Accessoires",
    buyPrice: 5000,
    sellPrice: 8500,
    stock: 42,
    depot: "Secondaire",
  },
  {
    id: "PRD004",
    name: "Coque protection",
    barcode: "789123456789",
    category: "Accessoires",
    buyPrice: 2000,
    sellPrice: 3500,
    stock: 57,
    depot: "Principal",
  },
  {
    id: "PRD005",
    name: "Carte mémoire 128GB",
    barcode: "321654987123",
    category: "Stockage",
    buyPrice: 12000,
    sellPrice: 18500,
    stock: 0,
    depot: "Principal",
  },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(product => product.category))];

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre catalogue de produits
            </p>
          </div>
          <Button className="bg-sama-600 hover:bg-sama-700">
            <Plus size={16} className="mr-2" />
            Nouveau produit
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
                  <TableHead>Produit</TableHead>
                  <TableHead className="hidden md:table-cell">Code-barres</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Prix de vente</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Dépôt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {product.id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Barcode size={16} className="mr-2 text-muted-foreground" />
                        {product.barcode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.sellPrice.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          product.stock === 0
                            ? "text-red-600 border-red-200 bg-red-50"
                            : product.stock <= 5
                            ? "text-amber-600 border-amber-200 bg-amber-50"
                            : "text-green-600 border-green-200 bg-green-50"
                        )}
                      >
                        {product.stock === 0 ? "Épuisé" : product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.depot}
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
                          <DropdownMenuItem>
                            <Package size={14} className="mr-2" /> Ajuster le stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash size={14} className="mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucun produit trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Products;
