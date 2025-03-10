
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search } from "lucide-react";
import { Client, clientsData } from "@/data/clientsData";
import { useClientsData } from "@/hooks/useClientsData";

interface ProformaFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reference: string;
  description: string;
  amount: string;
}

interface ProformaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProformaFormDialog({ open, onOpenChange }: ProformaFormDialogProps) {
  const { toast } = useToast();
  const { addClient } = useClientsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showCreateClientDialog, setShowCreateClientDialog] = useState(false);
  
  const form = useForm<ProformaFormValues>({
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      description: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = clientsData.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    form.setValue("clientName", client.name);
    form.setValue("clientEmail", client.email || "");
    form.setValue("clientPhone", client.phone || "");
    setShowResults(false);
    setSearchTerm("");
  };

  const handleCreateClient = () => {
    if (searchTerm.trim()) {
      const newClient = addClient({
        name: searchTerm,
        phone: "",
        email: "",
      });
      
      handleSelectClient(newClient);
      setShowCreateClientDialog(false);
    }
  };

  function onSubmit(data: ProformaFormValues) {
    toast({
      title: "Facture proforma créée",
      description: `Facture ${data.reference} créée pour ${data.clientName}`,
      duration: 3000,
    });
    form.reset();
    setSelectedClient(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une facture proforma</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Nom du client" 
                          value={selectedClient ? selectedClient.name : searchTerm}
                          onChange={(e) => {
                            if (selectedClient) {
                              setSelectedClient(null);
                            }
                            setSearchTerm(e.target.value);
                            field.onChange(e.target.value);
                          }}
                          required
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {showResults && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.length > 0 ? (
                    <ul className="py-1">
                      {searchResults.map((client) => (
                        <li 
                          key={client.id} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectClient(client)}
                        >
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.phone} {client.email ? `• ${client.email}` : ''}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="mb-2 text-gray-500">Aucun client trouvé</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCreateClient}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Créer un nouveau client
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
              
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
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
              control={form.control}
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
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Créer proforma</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
