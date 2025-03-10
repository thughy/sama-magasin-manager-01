
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Search } from "lucide-react";
import { InvoiceItem } from "@/services/api/invoicing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Item, Product, Service } from "@/types/product";
import { Label } from "@/components/ui/label";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  onAddItem: (item: any) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  onRemoveItem: (id: string) => void;
}

export function InvoiceItemsTable({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: InvoiceItemsTableProps) {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock products data (in real app, this would come from API)
  const [products, setProducts] = useState<Product[]>([
    { id: "prod1", type: "product", name: "Ordinateur portable", barcode: "12345", category: "Électronique", buyPrice: 350000, sellPrice: 450000, stock: 10, minStock: 2, depot: "Principal" },
    { id: "prod2", type: "product", name: "Téléphone mobile", barcode: "23456", category: "Électronique", buyPrice: 120000, sellPrice: 180000, stock: 15, minStock: 3, depot: "Principal" },
    { id: "prod3", type: "product", name: "Imprimante", barcode: "34567", category: "Électronique", buyPrice: 75000, sellPrice: 95000, stock: 8, minStock: 2, depot: "Principal" },
    { id: "prod4", type: "product", name: "Bureau", barcode: "45678", category: "Mobilier", buyPrice: 65000, sellPrice: 85000, stock: 5, minStock: 1, depot: "Principal" },
    { id: "prod5", type: "product", name: "Chaise", barcode: "56789", category: "Mobilier", buyPrice: 25000, sellPrice: 35000, stock: 20, minStock: 5, depot: "Principal" },
  ]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    onAddItem(product);
    setIsProductDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Articles</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsProductDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un article
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">Aucun article dans la facture. Cliquez sur "Ajouter un article" pour commencer.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead className="w-24">Quantité</TableHead>
                <TableHead className="w-32">Prix unitaire</TableHead>
                <TableHead className="w-32 text-right">Total</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, "quantity", Number(e.target.value) || 1)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, "unitPrice", Number(e.target.value) || 0)}
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.totalPrice.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()} FCFA
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Aucun produit trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.sellPrice.toLocaleString()} FCFA</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleProductSelect(product)}
                            disabled={product.stock <= 0}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Ajouter
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
