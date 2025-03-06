
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

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: any, type: "product" | "service") => void;
}

export function AddProductDialog({ open, onOpenChange, onAdd }: AddProductDialogProps) {
  const [activeTab, setActiveTab] = useState<"product" | "service">("product");
  
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const handleProductSubmit = (data: ProductFormValues) => {
    onAdd(data, "product");
    // Fermer le dialogue après l'ajout
    onOpenChange(false);
  };

  const handleServiceSubmit = (data: ServiceFormValues) => {
    onAdd(data, "service");
    // Fermer le dialogue après l'ajout
    onOpenChange(false);
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
            />
          </TabsContent>
          
          <TabsContent value="service">
            <ServiceForm 
              onSubmit={handleServiceSubmit}
              onCancel={handleCancel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
