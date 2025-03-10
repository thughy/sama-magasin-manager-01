
import React from "react";
import { Calendar, Hash, FileText } from "lucide-react";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const proformaSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  date: z.string().min(1, "La date est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  description: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1, "La description est requise"),
      quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
      unitPrice: z.number().min(1, "Le prix unitaire doit être supérieur à 0"),
      total: z.number(),
    })
  ).min(1, "Ajoutez au moins un article"),
});

export type ProformaValues = z.infer<typeof proformaSchema>;

interface ProformaFormHeaderProps {
  form: UseFormReturn<ProformaValues>;
}

export function ProformaFormHeader({ form }: ProformaFormHeaderProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Référence</FormLabel>
              <FormControl>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input type="date" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'échéance</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input type="date" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (optionnelle)</FormLabel>
            <FormControl>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input placeholder="Description du proforma" className="pl-10 h-24" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
