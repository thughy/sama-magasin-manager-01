
import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientsData } from "@/hooks/useClientsData";
import { Client } from "@/data/clientsData";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { toast } from "sonner";
import { UserRound, Search, Plus } from "lucide-react";

const formSchema = z.object({
  clientSearch: z.string().min(1, "Veuillez saisir un nom ou un identifiant de client"),
});

type FormValues = z.infer<typeof formSchema>;

interface NewProformaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProformaDialog({ open, onOpenChange }: NewProformaDialogProps) {
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { addClient, filteredClients } = useClientsData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientSearch: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset();
      setSelectedClient(null);
      setSearchResults([]);
    }
  }, [open, form]);

  const handleSearchClient = (data: FormValues) => {
    const searchTerm = data.clientSearch.toLowerCase();
    const results = filteredClients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.id.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm)
    );
    setSearchResults(results);
    
    if (results.length === 0) {
      toast.info("Aucun client trouvé. Vous pouvez créer un nouveau client.");
    }
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    form.reset();
    setSearchResults([]);
    toast.success(`Client ${client.name} sélectionné pour le proforma`);
  };

  const handleAddNewClient = (data: any) => {
    const newClient = addClient(data);
    setSelectedClient(newClient);
    setAddClientDialogOpen(false);
    toast.success(`Nouveau client ${newClient.name} créé et sélectionné`);
  };

  const handleCreateProforma = () => {
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client avant de créer le proforma");
      return;
    }

    // Logic to create the proforma with the selected client
    toast.success(`Proforma créé pour ${selectedClient.name}`);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau Proforma</DialogTitle>
            <DialogDescription>
              Sélectionnez un client existant ou créez un nouveau client pour ce proforma
            </DialogDescription>
          </DialogHeader>

          {!selectedClient ? (
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSearchClient)} className="space-y-4">
                  <FormField
                    control={form.control}
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

              {searchResults.length > 0 ? (
                <div className="border rounded-md">
                  <div className="px-4 py-3 bg-muted font-medium text-sm">
                    Résultats de recherche
                  </div>
                  <div className="divide-y max-h-[200px] overflow-y-auto">
                    {searchResults.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 flex items-center justify-between hover:bg-muted cursor-pointer"
                        onClick={() => handleSelectClient(client)}
                      >
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.id} • {client.phone}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Sélectionner
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UserRound className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Aucun client sélectionné</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Recherchez un client existant ou créez-en un nouveau
                  </p>
                  <Button onClick={() => setAddClientDialogOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Créer un nouveau client
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Client sélectionné</div>
                <div className="font-medium text-lg">{selectedClient.name}</div>
                <div className="text-sm">
                  <span className="text-muted-foreground">ID:</span> {selectedClient.id} •{" "}
                  <span className="text-muted-foreground">Tél:</span> {selectedClient.phone}
                </div>
                {selectedClient.email && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {selectedClient.email}
                  </div>
                )}
                {selectedClient.address && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Adresse:</span> {selectedClient.address}
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4">
                <div className="text-sm font-medium text-muted-foreground mb-3">Détails du proforma</div>
                <p className="text-sm text-muted-foreground italic">
                  Les détails du formulaire proforma seront implémentés ici
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between flex-row">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            {selectedClient ? (
              <Button onClick={handleCreateProforma} className="bg-sama-600 hover:bg-sama-700">
                Créer le proforma
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setAddClientDialogOpen(true)}
                className="bg-sama-600 hover:bg-sama-700"
              >
                <Plus size={16} className="mr-2" />
                Nouveau client
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddClientDialog
        open={addClientDialogOpen}
        onOpenChange={setAddClientDialogOpen}
        onSave={handleAddNewClient}
      />
    </>
  );
}
