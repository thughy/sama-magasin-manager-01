
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ProductFormValues } from "../schema/productSchema";

interface ProductPricesProps {
  control: Control<ProductFormValues>;
}

export function ProductPrices({ control }: ProductPricesProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="purchasePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix d'achat (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" {...field} className="w-full md:w-3/4" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="sellPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix de vente (FCFA)</FormLabel>
            <FormControl>
              <Input type="number" {...field} className="w-full md:w-3/4" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
