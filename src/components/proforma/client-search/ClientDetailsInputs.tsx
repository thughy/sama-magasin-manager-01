
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

interface ClientDetailsInputsProps {
  control: Control<ProformaFormValues>;
  selectedClient: boolean;
}

export function ClientDetailsInputs({ control, selectedClient }: ClientDetailsInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="clientEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Email du client" 
                {...field} 
                disabled={!selectedClient}
                className={!selectedClient ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="clientPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input 
                placeholder="Téléphone du client" 
                {...field} 
                disabled={!selectedClient}
                className={!selectedClient ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
