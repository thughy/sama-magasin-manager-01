
import React, { useState, useEffect } from "react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client, clientsData } from "@/data/clientsData";

interface ClientSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectClient: (client: Client) => void;
  onCreateClient: () => void;
  selectedClient: Client | null;
}

export function ClientSearchInput({ 
  value, 
  onChange, 
  onSelectClient, 
  onCreateClient, 
  selectedClient 
}: ClientSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (selectedClient) {
      // Reset selected client when user modifies the input
      onChange("");
    }
    setSearchTerm(newValue);
    onChange(newValue);
  };

  const handleClearClient = () => {
    onChange("");
    setSearchTerm("");
  };

  return (
    <FormItem>
      <FormLabel>Nom du client</FormLabel>
      <FormControl>
        <div className="relative">
          <Input 
            placeholder="Nom du client" 
            value={selectedClient ? selectedClient.name : searchTerm}
            onChange={handleChange}
            readOnly={!!selectedClient}
            disabled={!!selectedClient}
            className={selectedClient ? "bg-gray-100 cursor-not-allowed pr-16" : ""}
            required
          />
          {selectedClient ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={handleClearClient}
              title="Effacer le client sélectionné"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </FormControl>
      
      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((client) => (
                <li 
                  key={client.id} 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelectClient(client);
                    setShowResults(false);
                    setSearchTerm("");
                  }}
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
                onClick={() => {
                  onCreateClient();
                  setShowResults(false);
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Créer un nouveau client
              </Button>
            </div>
          )}
        </div>
      )}
    </FormItem>
  );
}
