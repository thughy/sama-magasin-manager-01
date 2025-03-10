
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveProformaData } from "./ProformaFormStep";

const saveProformaSchema = z.object({
  title: z.string().min(1, "Veuillez saisir un titre pour le proforma"),
  note: z.string().optional(),
});

interface SaveProformaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: SaveProformaData) => void;
  totalAmount: number;
}

export function SaveProformaDialog({ 
  open, 
  onOpenChange, 
  onSave,
  totalAmount 
}: SaveProformaDialogProps) {
  const form = useForm<SaveProformaData>({
    resolver: zodResolver(saveProformaSchema),
    defaultValues: {
      title: "",
      note: "",
    },
  });

  const handleSubmit = (data: SaveProformaData) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer le proforma</DialogTitle>
          <DialogDescription>
            Enregistrez ce proforma pour y accéder ultérieurement
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du proforma</FormLabel>
                  <FormControl>
                    <Input placeholder="Saisissez un titre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ajoutez une note à ce proforma..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Montant total:</span>
                <span className="font-bold text-lg">{totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-sama-600 hover:bg-sama-700">
                  Enregistrer
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
