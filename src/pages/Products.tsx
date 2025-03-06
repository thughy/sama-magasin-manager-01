
import { useState } from "react";
import { Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductsSearch } from "@/components/products/ProductsSearch";
import { ProductsTable } from "@/components/products/ProductsTable";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { initialItems } from "@/data/productsData";
import { Item, Product, Service } from "@/types/product";

const Products = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

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
          <ProductsSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            categories={categories}
          />

          <ProductsTable items={filteredItems} />
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
