
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
import { UserRound, Search, Plus, Calendar, Hash, FileText } from "lucide-react";

const clientSearchSchema = z.object({
  clientSearch: z.string().min(1, "Veuillez saisir un nom ou un identifiant de client"),
});

const proformaSchema = z.object({
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

type ClientSearchValues = z.infer<typeof clientSearchSchema>;
type ProformaValues = z.infer<typeof proformaSchema>;

interface NewProformaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProformaDialog({ open, onOpenChange }: NewProformaDialogProps) {
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentStep, setCurrentStep] = useState<'client-selection' | 'proforma-form'>('client-selection');
  const [items, setItems] = useState<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[]>([]);
  const { addClient, filteredClients } = useClientsData();

  const searchForm = useForm<ClientSearchValues>({
    resolver: zodResolver(clientSearchSchema),
    defaultValues: {
      clientSearch: "",
    },
  });

  const proformaForm = useForm<ProformaValues>({
    resolver: zodResolver(proformaSchema),
    defaultValues: {
      reference: `PRO-${new Date().getTime().toString().substring(0, 10)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: "",
      items: [],
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      searchForm.reset();
      proformaForm.reset({
        reference: `PRO-${new Date().getTime().toString().substring(0, 10)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: "",
        items: [],
      });
      setSelectedClient(null);
      setSearchResults([]);
      setCurrentStep('client-selection');
      setItems([]);
    }
  }, [open, searchForm, proformaForm]);

  const handleSearchClient = (data: ClientSearchValues) => {
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
    searchForm.reset();
    setSearchResults([]);
    setCurrentStep('proforma-form');
    toast.success(`Client ${client.name} sélectionné pour le proforma`);
  };

  const handleAddNewClient = (data: any) => {
    const newClient = addClient(data);
    setSelectedClient(newClient);
    setAddClientDialogOpen(false);
    setCurrentStep('proforma-form');
    toast.success(`Nouveau client ${newClient.name} créé et sélectionné`);
  };

  const addItem = () => {
    const newItem = {
      id: `item-${items.length + 1}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateProforma = (data: ProformaValues) => {
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client avant de créer le proforma");
      return;
    }

    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un article au proforma");
      return;
    }

    // In a real app, you would save the proforma to your database here
    toast.success(`Proforma créé pour ${selectedClient.name}`);
    onOpenChange(false);
  };

  const handleGoBack = () => {
    setCurrentStep('client-selection');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {currentStep === 'client-selection' ? 'Nouveau Proforma' : 'Facture Proforma'}
            </DialogTitle>
            <DialogDescription>
              {currentStep === 'client-selection' 
                ? 'Sélectionnez un client existant ou créez un nouveau client pour ce proforma'
                : 'Remplissez les détails de la facture proforma'}
            </DialogDescription>
          </DialogHeader>

          {currentStep === 'client-selection' ? (
            <div className="space-y-6">
              <Form {...searchForm}>
                <form onSubmit={searchForm.handleSubmit(handleSearchClient)} className="space-y-4">
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
                <div className="text-sm font-medium text-muted-foreground mb-1">Client</div>
                <div className="font-medium text-lg">{selectedClient?.name}</div>
                <div className="text-sm">
                  <span className="text-muted-foreground">ID:</span> {selectedClient?.id} •{" "}
                  <span className="text-muted-foreground">Tél:</span> {selectedClient?.phone}
                </div>
                {selectedClient?.email && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {selectedClient.email}
                  </div>
                )}
                {selectedClient?.address && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Adresse:</span> {selectedClient.address}
                  </div>
                )}
              </div>

              <Form {...proformaForm}>
                <form onSubmit={proformaForm.handleSubmit(handleCreateProforma)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={proformaForm.control}
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
                      control={proformaForm.control}
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
                      control={proformaForm.control}
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
                    control={proformaForm.control}
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
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Articles</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus size={16} className="mr-2" /> Ajouter un article
                      </Button>
                    </div>
                    
                    {items.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted text-xs">
                              <th className="px-4 py-2 text-left">Description</th>
                              <th className="px-4 py-2 text-right w-20">Quantité</th>
                              <th className="px-4 py-2 text-right w-28">Prix unit.</th>
                              <th className="px-4 py-2 text-right w-28">Total</th>
                              <th className="px-4 py-2 w-16"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => (
                              <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">
                                  <Input 
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    placeholder="Description de l'article"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    min="1"
                                    className="text-right"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Input 
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    className="text-right"
                                  />
                                </td>
                                <td className="px-4 py-2 text-right">
                                  {item.total.toLocaleString()} F
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    &times;
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t bg-muted font-medium">
                              <td colSpan={3} className="px-4 py-2 text-right">Total</td>
                              <td className="px-4 py-2 text-right">{getTotalAmount().toLocaleString()} F</td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="border rounded-md p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between flex-row mt-6">
            {currentStep === 'client-selection' ? (
              <>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={() => setAddClientDialogOpen(true)}
                  className="bg-sama-600 hover:bg-sama-700"
                >
                  <Plus size={16} className="mr-2" />
                  Nouveau client
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleGoBack}>
                  Retour
                </Button>
                <Button 
                  onClick={() => {
                    if (items.length === 0) {
                      toast.error("Veuillez ajouter au moins un article au proforma");
                      return;
                    }
                    handleCreateProforma(proformaForm.getValues());
                  }} 
                  className="bg-sama-600 hover:bg-sama-700"
                >
                  Créer le proforma
                </Button>
              </>
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
