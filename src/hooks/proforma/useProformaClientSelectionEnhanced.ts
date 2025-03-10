
import { useProformaClientSelection } from "./useProformaClientSelection";
import { UseFormReturn } from "react-hook-form";
import { ProformaFormValues } from "@/types/proforma";

export function useProformaClientSelectionEnhanced(form: UseFormReturn<ProformaFormValues>) {
  const {
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient: baseHandleSelectClient,
    handleCreateClient,
    handleSaveClient
  } = useProformaClientSelection();

  const handleClientSelect = (client: any) => {
    const selectedClient = baseHandleSelectClient(client);
    form.setValue("clientName", selectedClient.name);
    form.setValue("clientEmail", selectedClient.email || "");
    form.setValue("clientPhone", selectedClient.phone || "");
    return selectedClient;
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient: handleClientSelect,
    handleCreateClient,
    handleSaveClient
  };
}
