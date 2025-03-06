
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ProductsSearch } from "@/components/products/ProductsSearch";
import { ProductsTable } from "@/components/products/ProductsTable";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { EditProductDialog } from "@/components/products/EditProductDialog";
import { DeleteItemDialog } from "@/components/products/DeleteItemDialog";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { initialItems } from "@/data/productsData";
import { Item, Product, Service } from "@/types/product";

export const ProductsContainer = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type === "product" && (
        (item as Product).barcode.includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesCategory = selectedCategory === "all"
      ? true
      : (item.type === "product" && (item as Product).category === selectedCategory);
    
    const matchesType = selectedType === "all"
      ? true
      : item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(
    items
      .filter(item => item.type === "product")
      .map(item => (item as Product).category)
  )];

  const handleAddItem = useCallback((data: any, type: "product" | "service") => {
    const newId = type === "product" 
      ? `PRD${String(items.length + 1).padStart(3, '0')}` 
      : `SRV${String(items.length + 1).padStart(3, '0')}`;
    
    if (type === "product") {
      const newProduct: Product = {
        id: newId,
        type: "product",
        name: data.name,
        barcode: data.barcode || "",
        category: data.category,
        buyPrice: data.purchasePrice,
        sellPrice: data.sellPrice,
        stock: 0,
        minStock: data.minStock,
        depot: "Principal"
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
  }, [items, toast]);

  const handleEditItem = useCallback((data: any, type: "product" | "service", id: string) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        if (type === "product") {
          const updatedProduct: Product = {
            ...item as Product,
            name: data.name,
            barcode: data.barcode || "",
            category: data.category,
            buyPrice: data.purchasePrice,
            sellPrice: data.sellPrice,
            minStock: data.minStock,
          };
          return updatedProduct;
        } else {
          const updatedService: Service = {
            ...item as Service,
            name: data.name,
            amount: data.amount
          };
          return updatedService;
        }
      }
      return item;
    });
    
    setItems(updatedItems);
    setItemToEdit(null);
    
    toast({
      title: "Modifié avec succès",
      description: `${type === "product" ? "Article" : "Service"} a été mis à jour.`,
    });
  }, [items, toast]);

  const handleDeleteItem = useCallback((item: Item) => {
    setItemToDelete(item);
  }, []);

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      const updatedItems = items.filter(item => item.id !== itemToDelete.id);
      setItems(updatedItems);
      
      toast({
        title: "Supprimé avec succès",
        description: `${itemToDelete.type === "product" ? "Article" : "Service"} a été supprimé du catalogue.`,
        variant: "destructive",
      });
      
      setItemToDelete(null);
    }
  }, [itemToDelete, items, toast]);

  const refreshItems = useCallback(() => {
    setItems(initialItems);
    
    toast({
      title: "Catalogue rafraîchi",
      description: "Les données du catalogue ont été actualisées.",
    });
  }, [toast]);

  return (
    <div className="space-y-6 animate-scale-in">
      <ProductsHeader 
        onAddNew={() => setShowAddDialog(true)} 
        onRefresh={refreshItems}
      />

      <Card className="p-5">
        <ProductsSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          categories={categories}
        />

        <ProductsTable 
          items={filteredItems} 
          onEdit={setItemToEdit}
          onDelete={handleDeleteItem}
        />
      </Card>

      <AddProductDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAdd={handleAddItem}
        existingItems={items} 
      />

      {itemToEdit && (
        <EditProductDialog 
          open={!!itemToEdit}
          onOpenChange={() => setItemToEdit(null)}
          item={itemToEdit}
          onSave={handleEditItem}
          existingItems={items}
        />
      )}

      <DeleteItemDialog 
        open={!!itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
        item={itemToDelete}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};
