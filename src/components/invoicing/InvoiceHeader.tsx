
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientSearchInput } from "@/components/proforma/client-search/ClientSearchInput";
import { Client } from "@/data/clientsData";
import { useFormContext } from "react-hook-form";

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

  const handleClientSelection = (client: Client) => {
    onClientSelect(client);
    setValue("clientName", client.name);
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

      <div className="space-y-2">
        <ClientSearchInput 
          value={clientName}
          onChange={() => {}}
          onSelectClient={handleClientSelection}
          onCreateClient={() => {}}
          selectedClient={clientName ? { id: "", name: clientName } as Client : null}
        />
      </div>
    </div>
  );
};
