
import React, { useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schema for the depot form
const formSchema = z.object({
  name: z.string().min(1, "Le nom du dépôt est requis"),
  location: z.string().min(1, "L'adresse du dépôt est requise"),
  manager: z.string().min(1, "Le nom du responsable est requis"),
  type: z.enum(["principal", "secondaire"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddDepotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues) => void;
  hasPrimaryDepot: boolean;
}

export function AddDepotDialog({
  open,
  onOpenChange,
  onSave,
  hasPrimaryDepot,
}: AddDepotDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      manager: "",
      type: hasPrimaryDepot ? "secondaire" : "principal",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        location: "",
        manager: "",
        type: hasPrimaryDepot ? "secondaire" : "principal",
      });
      // Set focus on name input after a small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [open, form, hasPrimaryDepot]);

  const handleSubmit = (data: FormValues) => {
    if (data.type === "principal" && hasPrimaryDepot) {
      toast.error("Un dépôt principal existe déjà. Veuillez choisir 'secondaire'.");
      return;
    }
    
    onSave(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau dépôt</DialogTitle>
          <DialogDescription>
            Complétez les informations du dépôt ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du dépôt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom du dépôt"
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        nameInputRef.current = e;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse du dépôt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du responsable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de dépôt</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={hasPrimaryDepot && field.value !== "principal"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="principal" disabled={hasPrimaryDepot}>
                        Principal {hasPrimaryDepot && "(Un dépôt principal existe déjà)"}
                      </SelectItem>
                      <SelectItem value="secondaire">Secondaire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
