
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
import { Save } from "lucide-react";

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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-300">
        <Button type="button" variant="outline" onClick={onGoBack} className="w-full md:w-auto">
          Retour
        </Button>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button 
            type="button"
            onClick={() => setSaveDialogOpen(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-md shadow-md border-2 border-orange-400"
          >
            <Save size={22} />
            Enregistrer
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit} 
            className="w-full bg-sama-600 hover:bg-sama-700 py-3 text-base"
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
