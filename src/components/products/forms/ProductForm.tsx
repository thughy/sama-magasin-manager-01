
import React from "react";
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
}

export function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
    // Note: We're no longer resetting the form here because the dialog will close
    // and the component will unmount
  };

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
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
