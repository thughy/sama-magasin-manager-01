import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client } from "@/data/clientsData";
import { useFormContext } from "react-hook-form";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientSearchInput } from "./client/ClientSearchInput";
import { ClientContactInfo } from "./client/ClientContactInfo";

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
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const handleClientSelect = (client: Client) => {
    onClientSelect(client);
    setClientPhone(client.phone || "");
    setClientEmail(client.email || "");
  };

  const handleAddClient = () => {
    setIsAddClientDialogOpen(true);
  };

  const handleSaveClient = (data: { name: string; phone: string; email?: string; address?: string }) => {
    const newClient = {
      id: `client-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
    };
    
    handleClientSelect(newClient as Client);
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
        <ClientSearchInput 
          clientName={clientName}
          onClientSelect={handleClientSelect}
          onAddClient={handleAddClient}
        />
      </div>

      <ClientContactInfo phone={clientPhone} email={clientEmail} />

      <AddClientDialog 
        open={isAddClientDialogOpen} 
        onOpenChange={setIsAddClientDialogOpen} 
        onSave={handleSaveClient}
      />
    </div>
  );
};
