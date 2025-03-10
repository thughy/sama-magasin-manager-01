
import { useState, useMemo, useCallback } from "react";
import { clientsData, Client } from "@/data/clientsData";

export const useClientsData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [clients, setClients] = useState<Client[]>(clientsData);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType ? client.type === selectedType : true;
      
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

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredClients,
    clientTypes,
    refreshClients
  };
};
