
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, User } from "lucide-react";
import { Client, clientsData } from "@/data/clientsData";
import { useFormContext } from "react-hook-form";
import { DEFAULT_CLIENT } from "@/hooks/invoicing/useInvoiceForm";

interface ClientSearchInputProps {
  clientName: string;
  onClientSelect: (client: Client) => void;
  onAddClient: () => void;
}

export const ClientSearchInput = ({ 
  clientName, 
  onClientSelect, 
  onAddClient 
}: ClientSearchInputProps) => {
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState(clientName);
  const [clientExists, setClientExists] = useState(true);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setInputValue(clientName);
  }, [clientName]);

  useEffect(() => {
    // Check if client exists whenever input value changes
    if (inputValue.trim() === "") {
      setClientExists(true);
      setShowResults(false);
      return;
    }

    // Search for clients when at least 2 characters are typed
    if (inputValue.trim().length >= 2) {
      const results = clientsData.filter(client => 
        client.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        client.phone.includes(inputValue)
      );
      setSearchResults(results);
      setShowResults(true);
      
      // Check if exact client exists
      const exactClient = clientsData.find(
        client => client.name.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (exactClient) {
        setClientExists(true);
      } else {
        setClientExists(false);
      }
    } else {
      setShowResults(false);
    }
  }, [inputValue]);

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Still update the form value even if client doesn't exist yet
    onClientSelect({ id: "", name: value } as Client);
    setValue("clientName", value);
  };

  const handleClientSelect = (client: Client) => {
    onClientSelect(client);
    setValue("clientName", client.name);
    setInputValue(client.name);
    setClientExists(true);
    setShowResults(false);
  };

  const handleUseDefaultClient = () => {
    onClientSelect(DEFAULT_CLIENT as Client);
    setValue("clientName", DEFAULT_CLIENT.name);
    setInputValue(DEFAULT_CLIENT.name);
    setClientExists(true);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          id="clientName"
          value={inputValue}
          onChange={handleClientNameChange}
          placeholder="Entrez le nom du client ou laissez vide pour Client Comptoir"
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && inputValue.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((client) => (
                <li 
                  key={client.id} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.phone} {client.email ? `• ${client.email}` : ''}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Aucun client trouvé</p>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={onAddClient}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un nouveau client
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="w-full flex items-center justify-center"
                  onClick={handleUseDefaultClient}
                >
                  <User className="h-4 w-4 mr-2" />
                  Utiliser Client Comptoir
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Non-existent client prompt (only show when search results aren't displayed) */}
      {!showResults && !clientExists && inputValue.trim() !== "" && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded p-2 shadow-md z-10 w-full">
          <p className="text-sm text-muted-foreground mb-2">Ce client n'existe pas dans le système</p>
          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={onAddClient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un nouveau client
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full flex items-center justify-center"
              onClick={handleUseDefaultClient}
            >
              <User className="h-4 w-4 mr-2" />
              Utiliser Client Comptoir
            </Button>
          </div>
        </div>
      )}
      
      {/* Empty input prompt */}
      {inputValue.trim() === "" && (
        <div className="mt-1 text-sm text-gray-500 flex items-center">
          <User className="h-4 w-4 mr-1 inline" />
          <span>Vente attribuée au Client Comptoir par défaut</span>
        </div>
      )}
    </div>
  );
};
