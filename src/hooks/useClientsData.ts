
import { useState, useMemo, useCallback } from "react";
import { clientsData, Client } from "@/data/clientsData";

export interface NewClient {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export const useClientsData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [clients, setClients] = useState<Client[]>(clientsData);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all" ? true : client.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType, clients]);

  // Get unique client types
  const clientTypes = useMemo(() => {
    return [...new Set(clients.map(client => client.type))];
  }, [clients]);

  // Function to refresh clients data
  const refreshClients = useCallback(() => {
    // In a real app, this would make an API call to get fresh data
    // For now, we just reset to the original data
    setClients([...clientsData]);
  }, []);

  // Function to add a new client
  const addClient = useCallback((newClient: NewClient) => {
    const clientId = `CLI${String(clients.length + 1).padStart(3, '0')}`;
    const clientType = "Nouveau";
    
    const client: Client = {
      id: clientId,
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email || "",
      address: newClient.address || "",
      type: clientType,
      balance: 0,
      lastPurchase: new Date().toLocaleDateString('fr-FR')
    };
    
    setClients(prevClients => [...prevClients, client]);
    return client;
  }, [clients]);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredClients,
    clientTypes,
    refreshClients,
    addClient
  };
};
