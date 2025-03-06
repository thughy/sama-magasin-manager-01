
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
import { DialogFooter } from "@/components/ui/dialog";

// Form validation schema for Service
const serviceSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  amount: z.coerce.number().min(0, "Le montant doit être positif"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
  initialValues?: ServiceFormValues;
  isEditMode?: boolean;
}

export function ServiceForm({ 
  onSubmit, 
  onCancel,
  initialValues,
  isEditMode = false
}: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialValues || {
      name: "",
      amount: 0,
    },
  });

  // Reference to the name input for focusing
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (data: ServiceFormValues) => {
    onSubmit(data);
    
    // Only reset the form if not in edit mode
    if (!isEditMode) {
      // Reset form after submission
      form.reset({
        name: "",
        amount: 0,
      });
      
      // Focus on the name input after form reset
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du service</FormLabel>
              <FormControl>
                <Input {...field} ref={nameInputRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
