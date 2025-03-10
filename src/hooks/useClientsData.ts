
import { useState, useMemo } from "react";
import { clientsData, Client } from "@/data/clientsData";

export const useClientsData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  const filteredClients = useMemo(() => {
    return clientsData.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType ? client.type === selectedType : true;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  // Get unique client types
  const clientTypes = useMemo(() => {
    return [...new Set(clientsData.map(client => client.type))];
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredClients,
    clientTypes
  };
};
