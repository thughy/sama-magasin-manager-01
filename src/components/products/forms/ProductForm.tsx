
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { productSchema, ProductFormValues } from "./schema/productSchema";
import { ProductBasicInfo } from "./components/ProductBasicInfo";
import { ProductPrices } from "./components/ProductPrices";
import { ProductDetails } from "./components/ProductDetails";

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  onCancel: () => void;
  initialValues?: ProductFormValues;
  isEditMode?: boolean;
}

export function ProductForm({ 
  onSubmit, 
  onCancel, 
  initialValues,
  isEditMode = false 
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      barcode: "",
      name: "",
      sellPrice: 0,
      purchasePrice: 0,
      category: "",
      minStock: 0,
    },
  });

  // Reference to the name input for focusing
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
    
    // Only reset the form if not in edit mode
    if (!isEditMode) {
      // Reset the form after submission but don't close the dialog
      form.reset({
        barcode: "",
        name: "",
        sellPrice: 0,
        purchasePrice: 0,
        category: "",
        minStock: 0,
      });
      
      // Focus on the name input after form reset
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 0);
    }
  };

  // Focus on name input when component mounts (only in add mode)
  useEffect(() => {
    if (!isEditMode && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <ProductBasicInfo control={form.control} nameInputRef={nameInputRef} />
        <ProductPrices control={form.control} />
        <ProductDetails control={form.control} />
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditMode ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
