
import { useState } from "react";
import { Client } from "@/data/clientsData";
import { useClientsData } from "@/hooks/useClientsData";

export function useProformaClientSelection() {
  const { addClient } = useClientsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setSearchTerm("");
    return client;
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
    
    return handleSelectClient(newClient);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient,
    handleCreateClient,
    handleSaveClient
  };
}
