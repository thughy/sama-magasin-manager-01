
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client, clientsData } from "@/data/clientsData";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Search, Phone, Mail } from "lucide-react";
import { AddClientDialog } from "@/components/clients/AddClientDialog";

interface InvoiceHeaderProps {
  reference: string;
  date: string;
  clientName: string;
  onReferenceChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClientSelect: (client: Client) => void;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  reference,
  date,
  clientName,
  onReferenceChange,
  onDateChange,
  onClientSelect,
}) => {
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState(clientName);
  const [clientExists, setClientExists] = useState(true);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  useEffect(() => {
    setInputValue(clientName);
  }, [clientName]);

  useEffect(() => {
    // Check if client exists whenever input value changes
    if (inputValue.trim() === "") {
      setClientExists(true);
      setShowResults(false);
      setClientPhone("");
      setClientEmail("");
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
        setClientPhone(exactClient.phone);
        setClientEmail(exactClient.email);
      } else {
        setClientExists(false);
        setClientPhone("");
        setClientEmail("");
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

  const handleAddClient = () => {
    setIsAddClientDialogOpen(true);
  };

  const handleClientSelect = (client: Client) => {
    onClientSelect(client);
    setValue("clientName", client.name);
    setInputValue(client.name);
    setClientExists(true);
    setClientPhone(client.phone);
    setClientEmail(client.email);
    setShowResults(false);
  };

  const handleSaveClient = (data: { name: string; phone: string; email?: string; address?: string }) => {
    // Find the client that was just created
    const newClient = clientsData.find(client => 
      client.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (newClient) {
      onClientSelect(newClient);
      setValue("clientName", newClient.name);
      setInputValue(newClient.name);
      setClientPhone(newClient.phone);
      setClientEmail(newClient.email || "");
      setClientExists(true);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => {
              onReferenceChange(e.target.value);
              setValue("reference", e.target.value);
            }}
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => {
              onDateChange(e.target.value);
              setValue("date", e.target.value);
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="clientName">Nom du client</Label>
        <div className="relative">
          <div className="relative">
            <Input
              id="clientName"
              value={inputValue}
              onChange={handleClientNameChange}
              placeholder="Entrez le nom du client"
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
                  {!clientExists && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={handleAddClient}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un nouveau client
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Non-existent client prompt (only show when search results aren't displayed) */}
          {!showResults && !clientExists && inputValue.trim() !== "" && (
            <div className="absolute right-0 top-full mt-1 bg-white border rounded p-2 shadow-md z-10 w-full">
              <p className="text-sm text-muted-foreground mb-2">Ce client n'existe pas dans le système</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={handleAddClient}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un nouveau client
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add phone and email fields aligned in a row */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="relative">
          <Label htmlFor="clientPhone">Téléphone</Label>
          <div className="relative">
            <Input
              id="clientPhone"
              value={clientPhone}
              readOnly
              placeholder="Téléphone du client"
              className="pl-10"
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="clientEmail">Email</Label>
          <div className="relative">
            <Input
              id="clientEmail"
              value={clientEmail}
              readOnly
              placeholder="Email du client"
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <AddClientDialog 
        open={isAddClientDialogOpen} 
        onOpenChange={setIsAddClientDialogOpen} 
        onSave={handleSaveClient}
      />
    </div>
  );
};
