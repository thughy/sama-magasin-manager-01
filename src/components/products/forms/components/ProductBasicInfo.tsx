
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Barcode } from "lucide-react";
import { Control } from "react-hook-form";
import { ProductFormValues } from "../schema/productSchema";

interface ProductBasicInfoProps {
  control: Control<ProductFormValues>;
  nameInputRef: React.RefObject<HTMLInputElement>;
}

export function ProductBasicInfo({ control, nameInputRef }: ProductBasicInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="barcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Barcode className="mr-2 h-4 w-4" />
              Code-barres (optionnel)
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'article</FormLabel>
            <FormControl>
              <Input {...field} ref={nameInputRef} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
