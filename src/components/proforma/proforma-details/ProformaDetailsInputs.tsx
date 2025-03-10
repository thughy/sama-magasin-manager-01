
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ProformaFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reference: string;
  description: string;
  amount: string;
}

interface ProformaDetailsInputsProps {
  control: Control<ProformaFormValues>;
}

export function ProformaDetailsInputs({ control }: ProformaDetailsInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Description des articles/services" {...field} required />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Montant (XOF)</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Montant total" 
                {...field} 
                required 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
