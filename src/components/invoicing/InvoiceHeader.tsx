
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onClientSelect({ id: "", name: value } as Client);
    setValue("clientName", value);
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
        <Input
          id="clientName"
          value={clientName}
          onChange={handleClientNameChange}
          placeholder="Entrez le nom du client"
        />
      </div>
    </div>
  );
};
