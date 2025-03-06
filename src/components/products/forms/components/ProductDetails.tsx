
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tags, Plus } from "lucide-react";
import { Control } from "react-hook-form";
import { ProductFormValues } from "../schema/productSchema";
import { Button } from "@/components/ui/button";

// Sample categories
const predefinedCategories = [
  { id: "1", name: "Électronique" },
  { id: "2", name: "Accessoires" },
  { id: "3", name: "Stockage" },
];

interface ProductDetailsProps {
  control: Control<ProductFormValues>;
}

export function ProductDetails({ control }: ProductDetailsProps) {
  const [categories, setCategories] = useState(predefinedCategories);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: `${categories.length + 1}`,
        name: newCategoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
    }
  };

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
            {!showNewCategoryInput ? (
              <div className="space-y-2">
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
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => setShowNewCategoryInput(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle catégorie
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nom de la catégorie"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={handleAddCategory}
                  >
                    Ajouter
                  </Button>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => setShowNewCategoryInput(false)}
                >
                  Annuler
                </Button>
              </div>
            )}
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
