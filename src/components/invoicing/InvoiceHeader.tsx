
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client, clientsData } from "@/data/clientsData";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  useEffect(() => {
    setInputValue(clientName);
  }, [clientName]);

  useEffect(() => {
    // Check if client exists whenever input value changes
    if (inputValue.trim() === "") {
      setClientExists(true);
      return;
    }

    const exists = clientsData.some(
      client => client.name.toLowerCase() === inputValue.toLowerCase()
    );
    setClientExists(exists);
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

  const handleSaveClient = (data: { name: string; phone: string; email?: string; address?: string }) => {
    // Find the client that was just created
    const newClient = clientsData.find(client => 
      client.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (newClient) {
      onClientSelect(newClient);
      setValue("clientName", newClient.name);
      setInputValue(newClient.name);
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
          <Input
            id="clientName"
            value={inputValue}
            onChange={handleClientNameChange}
            placeholder="Entrez le nom du client"
          />
          {!clientExists && inputValue.trim() !== "" && (
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

      <AddClientDialog 
        open={isAddClientDialogOpen} 
        onOpenChange={setIsAddClientDialogOpen} 
        onSave={handleSaveClient}
      />
    </div>
  );
};
