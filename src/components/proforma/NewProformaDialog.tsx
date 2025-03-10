
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientSelectionStep } from "./client-selection/ClientSelectionStep";
import { ProformaFormStep } from "./proforma-form/ProformaFormStep";
import { useProformaDialog } from "@/hooks/useProformaDialog";

interface NewProformaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProformaDialog({ open, onOpenChange }: NewProformaDialogProps) {
  const {
    addClientDialogOpen,
    setAddClientDialogOpen,
    searchResults,
    selectedClient,
    currentStep,
    items,
    searchForm,
    proformaForm,
    handleSearchClient,
    handleSelectClient,
    handleAddNewClient,
    addItem,
    removeItem,
    updateItem,
    getTotalAmount,
    handleCreateProforma,
    handleGoBack,
  } = useProformaDialog(open, onOpenChange);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {currentStep === 'client-selection' ? 'Nouveau Proforma' : 'Facture Proforma'}
            </DialogTitle>
            <DialogDescription>
              {currentStep === 'client-selection' 
                ? 'Sélectionnez un client existant ou créez un nouveau client pour ce proforma'
                : 'Remplissez les détails de la facture proforma'}
            </DialogDescription>
          </DialogHeader>

          {currentStep === 'client-selection' ? (
            <ClientSelectionStep
              searchForm={searchForm}
              searchResults={searchResults}
              onSearchClient={handleSearchClient}
              onSelectClient={handleSelectClient}
              onAddNewClient={() => setAddClientDialogOpen(true)}
              onCancel={() => onOpenChange(false)}
            />
          ) : (
            selectedClient && (
              <ProformaFormStep
                client={selectedClient}
                proformaForm={proformaForm}
                items={items}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
                getTotalAmount={getTotalAmount}
                onGoBack={handleGoBack}
                onCreateProforma={handleCreateProforma}
              />
            )
          )}
        </DialogContent>
      </Dialog>

      <AddClientDialog
        open={addClientDialogOpen}
        onOpenChange={setAddClientDialogOpen}
        onSave={handleAddNewClient}
      />
    </>
  );
}
