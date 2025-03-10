
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ClientCard } from "./ClientCard";
import { ProformaFormHeader, ProformaValues } from "./ProformaFormHeader";
import { ProformaItems } from "./ProformaItems";
import { Client } from "@/data/clientsData";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { SaveProformaDialog } from "./SaveProformaDialog";

interface ProformaItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ProformaFormStepProps {
  client: Client;
  proformaForm: UseFormReturn<ProformaValues>;
  items: ProformaItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: string, value: string | number) => void;
  getTotalAmount: () => number;
  onGoBack: () => void;
  onCreateProforma: (data: ProformaValues) => void;
  onSaveProforma: (data: ProformaValues, saveData: SaveProformaData) => void;
}

export function ProformaFormStep({
  client,
  proformaForm,
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  getTotalAmount,
  onGoBack,
  onCreateProforma,
  onSaveProforma,
}: ProformaFormStepProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un article au proforma");
      return;
    }
    onCreateProforma(proformaForm.getValues());
  };

  const handleSave = (saveData: SaveProformaData) => {
    if (items.length === 0) {
      toast.error("Veuillez ajouter au moins un article au proforma");
      return;
    }
    onSaveProforma(proformaForm.getValues(), saveData);
    setSaveDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <ClientCard client={client} />

      <Form {...proformaForm}>
        <form onSubmit={proformaForm.handleSubmit(onCreateProforma)} className="space-y-6">
          <ProformaFormHeader form={proformaForm} />
          
          <ProformaItems
            items={items}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            getTotalAmount={getTotalAmount}
          />
        </form>
      </Form>

      <div className="flex justify-between sm:justify-between flex-row mt-6">
        <Button type="button" variant="outline" onClick={onGoBack}>
          Retour
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setSaveDialogOpen(true)}
          >
            Enregistrer
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-sama-600 hover:bg-sama-700"
          >
            Créer le proforma
          </Button>
        </div>
      </div>

      <SaveProformaDialog 
        open={saveDialogOpen} 
        onOpenChange={setSaveDialogOpen} 
        onSave={handleSave}
        totalAmount={getTotalAmount()}
      />
    </div>
  );
}

export interface SaveProformaData {
  title: string;
  note: string;
}
