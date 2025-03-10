
import { useState, useEffect } from "react";
import { Client } from "@/data/clientsData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useClientsData } from "@/hooks/useClientsData";
import { toast } from "sonner";
import { ClientSearchValues } from "@/components/proforma/client-selection/ClientSearch";
import { ProformaValues, proformaSchema } from "@/components/proforma/proforma-form/ProformaFormHeader";
import { SaveProformaData } from "@/components/proforma/proforma-form/ProformaFormStep";

const clientSearchSchema = z.object({
  clientSearch: z.string().min(1, "Veuillez saisir un nom ou un identifiant de client"),
});

interface ProformaItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function useProformaDialog(open: boolean, onOpenChange: (open: boolean) => void) {
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentStep, setCurrentStep] = useState<'client-selection' | 'proforma-form'>('client-selection');
  const [items, setItems] = useState<ProformaItem[]>([]);
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

  const handleSaveProforma = (data: ProformaValues, saveData: SaveProformaData) => {
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client avant d'enregistrer le proforma");
      return;
    }

    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un article au proforma");
      return;
    }

    // En réalité, vous sauvegarderiez le proforma dans votre base de données ici
    toast.success(`Proforma "${saveData.title}" enregistré pour ${selectedClient.name}`);
    onOpenChange(false);
  };

  const handleGoBack = () => {
    setCurrentStep('client-selection');
  };

  return {
    addClientDialogOpen,
    setAddClientDialogOpen,
    searchResults,
    selectedClient,
    currentStep,
    items,
    searchForm,
    proformaForm,
    handleSearchClient,
    handleSelectClient,
    handleAddNewClient,
    addItem,
    removeItem,
    updateItem,
    getTotalAmount,
    handleCreateProforma,
    handleSaveProforma,
    handleGoBack,
  };
}
