
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
import { Barcode, Search, Trash2 } from "lucide-react";
import { InvoiceItem } from "@/services/api/invoicing";
import { Item } from "@/types/product";
import { initialItems } from "@/data/productsData";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (value.length >= 2) {
      const results = initialItems.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(value.toLowerCase());
        const barcodeMatch = 
          item.type === "product" && 
          item.barcode.includes(value);
        
        return nameMatch || barcodeMatch;
      });
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const handleSelectItem = (item: Item) => {
    const newItem = {
      id: `item-${Date.now()}`,
      productId: item.id,
      productName: item.name,
      quantity: 1,
      unitPrice: item.type === 'product' ? item.sellPrice : item.amount,
      totalPrice: item.type === 'product' ? item.sellPrice : item.amount,
      type: item.type
    };
    
    onAddItem(newItem);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Articles et services</h3>
        <div className="relative w-2/3">
          <Input
            placeholder="Rechercher un article ou service par nom ou code barre..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10 w-full"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Barcode className="h-4 w-4 text-gray-400" />
          </div>
          
          {showResults && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.length > 0 ? (
                <ul className="py-1">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                        {item.type === "product" ? (
                          <>
                            <span>Code: {item.barcode}</span>
                            <span>Prix: {item.sellPrice.toLocaleString()} FCFA</span>
                            <span>Stock: {item.stock}</span>
                          </>
                        ) : (
                          <span>Prix: {item.amount.toLocaleString()} FCFA</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Aucun article ou service trouvé
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">Aucun article/service dans la facture. Recherchez un article ou service pour l'ajouter.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article/Service</TableHead>
                <TableHead className="w-24">Quantité</TableHead>
                <TableHead className="w-32">Prix unitaire</TableHead>
                <TableHead className="w-32 text-right">Total</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {item.productName}
                      {item.type === 'service' && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          Service
                        </span>
                      )}
                    </div>
                  </TableCell>
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
    </div>
  );
}
