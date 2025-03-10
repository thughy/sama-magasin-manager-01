
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientSearchInput } from "./client-search/ClientSearchInput";
import { ClientDetailsInputs } from "./client-search/ClientDetailsInputs";
import { ProformaDetailsInputs } from "./proforma-details/ProformaDetailsInputs";
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
    onSubmit
  } = useProformaForm(() => onOpenChange(false));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer une facture proforma</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
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
              
              <ClientDetailsInputs 
                control={form.control}
                selectedClient={!!selectedClient}
              />
              
              <ProformaDetailsInputs control={form.control} />
              
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
