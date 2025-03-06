
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tags } from "lucide-react";
import { Control } from "react-hook-form";
import { ProductFormValues } from "../schema/productSchema";

// Sample categories
const categories = [
  { id: "1", name: "Électronique" },
  { id: "2", name: "Accessoires" },
  { id: "3", name: "Stockage" },
];

interface ProductDetailsProps {
  control: Control<ProductFormValues>;
}

export function ProductDetails({ control }: ProductDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Tags className="mr-2 h-4 w-4" />
              Catégorie
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="minStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock minimum</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
