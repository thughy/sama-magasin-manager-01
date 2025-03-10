
import React from "react";
import { Search } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

const clientSearchSchema = z.object({
  clientSearch: z.string().min(1, "Veuillez saisir un nom ou un identifiant de client"),
});

export type ClientSearchValues = z.infer<typeof clientSearchSchema>;

interface ClientSearchProps {
  searchForm: UseFormReturn<ClientSearchValues>;
  onSubmit: (data: ClientSearchValues) => void;
  onAddNewClient: () => void;
}

export function ClientSearch({ searchForm, onSubmit, onAddNewClient }: ClientSearchProps) {
  return (
    <div className="space-y-6">
      <Form {...searchForm}>
        <form onSubmit={searchForm.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={searchForm.control}
            name="clientSearch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rechercher un client</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Nom, ID ou téléphone du client"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <Button type="submit">Rechercher</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
