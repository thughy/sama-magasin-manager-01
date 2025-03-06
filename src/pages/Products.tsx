
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductsSearch } from "@/components/products/ProductsSearch";
import { ProductsTable } from "@/components/products/ProductsTable";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { initialItems } from "@/data/productsData";
import { Item, Product, Service } from "@/types/product";
import { EditProductDialog } from "@/components/products/EditProductDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Products = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  // For debugging
  console.log("Items in Products.tsx:", items);

  const filteredItems = items.filter(item => {
    // Filter by search term
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type === "product" && (
        (item as Product).barcode.includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Filter by category (products only)
    const matchesCategory = selectedCategory === "all"
      ? true
      : (item.type === "product" && (item as Product).category === selectedCategory);
    
    // Filter by type (product or service)
    const matchesType = selectedType === "all"
      ? true
      : item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // For debugging
  console.log("Filtered items in Products.tsx:", filteredItems);

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
        barcode: data.barcode || "", // Handle empty barcode
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

  const handleEditItem = (data: any, type: "product" | "service", id: string) => {
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
  };

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
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
  };

  const refreshItems = () => {
    // Dans une application réelle, ceci pourrait être un appel API
    // Pour cette démo, nous réinitialisons simplement les données
    setItems(initialItems);
    
    toast({
      title: "Catalogue rafraîchi",
      description: "Les données du catalogue ont été actualisées.",
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={refreshItems}
              className="gap-2"
            >
              <RefreshCw size={16} />
              Actualiser
            </Button>
            <Button className="bg-sama-600 hover:bg-sama-700" onClick={() => setShowAddDialog(true)}>
              <Plus size={16} className="mr-2" />
              Nouvel article/service
            </Button>
          </div>
        </div>

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
      </div>

      <AddProductDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAdd={handleAddItem} 
      />

      {itemToEdit && (
        <EditProductDialog 
          open={!!itemToEdit}
          onOpenChange={() => setItemToEdit(null)}
          item={itemToEdit}
          onSave={handleEditItem}
        />
      )}

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cet élément sera définitivement supprimé
              du catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Products;
