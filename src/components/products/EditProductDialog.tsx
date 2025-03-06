
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { ProductForm } from "./forms/ProductForm";
import { ProductFormValues } from "./forms/schema/productSchema";
import { ServiceForm, ServiceFormValues } from "./forms/ServiceForm";
import { Item, Product, Service } from "@/types/product";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item;
  onSave: (data: any, type: "product" | "service", id: string) => void;
  existingItems: Item[];
}

export function EditProductDialog({ 
  open, 
  onOpenChange, 
  item, 
  onSave,
  existingItems
}: EditProductDialogProps) {
  const [activeTab, setActiveTab] = useState<"product" | "service">(item.type);
  
  useEffect(() => {
    // Définir l'onglet actif en fonction du type d'élément
    setActiveTab(item.type);
  }, [item]);
  
  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const handleProductSubmit = (data: ProductFormValues) => {
    onSave(data, "product", item.id);
    onOpenChange(false);
  };

  const handleServiceSubmit = (data: ServiceFormValues) => {
    onSave(data, "service", item.id);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Préparer les valeurs initiales pour le formulaire produit
  const productInitialValues = item.type === "product" ? {
    name: (item as Product).name,
    barcode: (item as Product).barcode,
    sellPrice: (item as Product).sellPrice,
    purchasePrice: (item as Product).buyPrice,
    category: (item as Product).category,
    minStock: (item as Product).minStock,
  } : undefined;

  // Préparer les valeurs initiales pour le formulaire service
  const serviceInitialValues = item.type === "service" ? {
    name: (item as Service).name,
    amount: (item as Service).amount,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier {item.type === "product" ? "l'article" : "le service"}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "product" | "service")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product" className="flex items-center" disabled={item.type !== "product"}>
              <Package className="mr-2 h-4 w-4" />
              Article
            </TabsTrigger>
            <TabsTrigger value="service" disabled={item.type !== "service"}>Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="product">
            {productInitialValues && (
              <ProductForm 
                onSubmit={handleProductSubmit}
                onCancel={handleCancel}
                initialValues={productInitialValues}
                isEditMode
                existingItems={existingItems}
              />
            )}
          </TabsContent>
          
          <TabsContent value="service">
            {serviceInitialValues && (
              <ServiceForm 
                onSubmit={handleServiceSubmit}
                onCancel={handleCancel}
                initialValues={serviceInitialValues}
                isEditMode
                existingItems={existingItems}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
