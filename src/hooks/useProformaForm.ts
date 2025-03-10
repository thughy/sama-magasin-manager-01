
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@/data/clientsData";
import { useToast } from "@/components/ui/use-toast";
import { useClientsData } from "@/hooks/useClientsData";

export interface ProformaFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reference: string;
  description: string;
  amount: string;
}

export function useProformaForm(onClose: () => void) {
  const { toast } = useToast();
  const { addClient } = useClientsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  
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

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    form.setValue("clientName", client.name);
    form.setValue("clientEmail", client.email || "");
    form.setValue("clientPhone", client.phone || "");
    setSearchTerm("");
  };

  const handleCreateClient = () => {
    setClientDialogOpen(true);
  };

  const handleSaveClient = (data: { name: string; phone: string; email?: string; address?: string }) => {
    const newClient = addClient({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address
    });
    
    handleSelectClient(newClient);
  };

  function onSubmit(data: ProformaFormValues) {
    toast({
      title: "Facture proforma créée",
      description: `Facture ${data.reference} créée pour ${data.clientName}`,
      duration: 3000,
    });
    form.reset();
    setSelectedClient(null);
    onClose();
  }

  return {
    form,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient,
    handleCreateClient,
    handleSaveClient,
    onSubmit
  };
}
