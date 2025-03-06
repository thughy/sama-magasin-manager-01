
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Barcode, Tags } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

// Sample categories
const categories = [
  { id: "1", name: "Électronique" },
  { id: "2", name: "Accessoires" },
  { id: "3", name: "Stockage" },
];

// Form validation schema for Product
const productSchema = z.object({
  barcode: z.string().min(1, "Le code-barres est requis"),
  name: z.string().min(1, "Le nom est requis"),
  sellPrice: z.coerce.number().min(0, "Le prix doit être positif"),
  purchasePrice: z.coerce.number().min(0, "Le prix doit être positif"),
  category: z.string().min(1, "La catégorie est requise"),
  minStock: z.coerce.number().min(0, "Le stock minimum doit être positif"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

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
    // Reset the form after submission
    form.reset({
      barcode: "",
      name: "",
      sellPrice: 0,
      purchasePrice: 0,
      category: "",
      minStock: 0,
    });
    // Focus on the name field after form reset
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Barcode className="mr-2 h-4 w-4" />
                  Code-barres
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
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
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix d'achat (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sellPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de vente (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
