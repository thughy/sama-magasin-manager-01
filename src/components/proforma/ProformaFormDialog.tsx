
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientSearchInput } from "./client-search/ClientSearchInput";
import { ClientDetailsInputs } from "./client-search/ClientDetailsInputs";
import { ProformaDetailsInputs } from "./proforma-details/ProformaDetailsInputs";
import { ProformaItems } from "./proforma-items/ProformaItems";
import { useProformaForm } from "@/hooks/useProformaForm";

interface ProformaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProformaFormDialog({ open, onOpenChange }: ProformaFormDialogProps) {
  const {
    form,
    searchTerm,
    setSearchTerm,
    selectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient,
    handleCreateClient,
    handleSaveClient,
    onSubmit,
    // Articles et services
    proformaItems,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    calculateTotalAmount
  } = useProformaForm(() => onOpenChange(false));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une facture proforma</DialogTitle>
            <DialogDescription>
              Créez une facture proforma pour un client avec articles et services
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <ClientSearchInput
                        value={searchTerm}
                        onChange={(value) => {
                          setSearchTerm(value);
                          field.onChange(value);
                        }}
                        onSelectClient={handleSelectClient}
                        onCreateClient={handleCreateClient}
                        selectedClient={selectedClient}
                      />
                    )}
                  />
                </div>
                
                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Référence</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-100" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <ClientDetailsInputs 
                control={form.control}
                selectedClient={!!selectedClient}
              />
              
              <ProformaDetailsInputs control={form.control} />
              
              <ProformaItems
                items={proformaItems}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
              />
              
              <div className="text-right text-xl font-bold mt-4">
                Total: {calculateTotalAmount().toLocaleString()} XOF
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer proforma</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AddClientDialog 
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        onSave={handleSaveClient}
      />
    </>
  );
}
