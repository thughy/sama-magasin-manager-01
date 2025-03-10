
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientSearchInput } from "@/components/proforma/client-search/ClientSearchInput";
import { Client } from "@/data/clientsData";

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
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Client</Label>
        <div className="relative">
          <Input
            value={clientName}
            onChange={(e) => {}}
            placeholder="Sélectionner un client"
            className="w-full"
            readOnly
          />
          <div className="absolute inset-0">
            <ClientSearchInput 
              value={clientName}
              onChange={() => {}}
              onSelectClient={onClientSelect}
              onCreateClient={() => {}}
              selectedClient={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
