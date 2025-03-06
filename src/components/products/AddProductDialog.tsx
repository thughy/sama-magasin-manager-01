
import React, { useState } from "react";
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
import { Item } from "@/types/product";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: any, type: "product" | "service") => void;
  existingItems: Item[];
}

export function AddProductDialog({ open, onOpenChange, onAdd, existingItems }: AddProductDialogProps) {
  const [activeTab, setActiveTab] = useState<"product" | "service">("product");
  
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const handleProductSubmit = (data: ProductFormValues) => {
    onAdd(data, "product");
    // Don't close the dialog after adding a product
  };

  const handleServiceSubmit = (data: ServiceFormValues) => {
    onAdd(data, "service");
    // Don't close the dialog after adding a service
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel Article/Service</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "product" | "service")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Article
            </TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="product">
            <ProductForm 
              onSubmit={handleProductSubmit}
              onCancel={handleCancel}
              existingItems={existingItems}
            />
          </TabsContent>
          
          <TabsContent value="service">
            <ServiceForm 
              onSubmit={handleServiceSubmit}
              onCancel={handleCancel}
              existingItems={existingItems}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
