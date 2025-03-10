
import { ProformaFormValues } from "@/types/proforma";
import { useProformaSubmission } from "./useProformaSubmission";
import { useProformaEditor } from "./useProformaEditor";
import { useProformaPrinting } from "./useProformaPrinting";
import { Proforma } from "@/components/proforma/ProformasTable";
import { useProformaFormState } from "./useProformaFormState";
import { useProformaFormReset } from "./useProformaFormReset";
import { useProformaLoader } from "./useProformaLoader";
import { useProformaClientSelectionEnhanced } from "./useProformaClientSelectionEnhanced";

export type { ProformaFormValues } from "@/types/proforma";

export function useProformaForm(onClose: () => void) {
  const {
    proformas,
    proformaItems,
    setProformaItems,
    showPrintDialog,
    setShowPrintDialog,
    currentProforma,
    setCurrentProforma,
    isLoading,
    setIsLoading,
    isEditMode,
    setIsEditMode,
    loadProformas,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    calculateTotalAmount
  } = useProformaEditor();

  // Use the form state hook
  const { form, defaultValues } = useProformaFormState(isEditMode, currentProforma);

  // Use the enhanced client selection hook
  const {
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient,
    handleCreateClient,
    handleSaveClient
  } = useProformaClientSelectionEnhanced(form);

  // Use the form reset hook
  const { resetForm } = useProformaFormReset({
    form,
    defaultValues,
    setSelectedClient,
    setProformaItems,
    setSearchTerm,
    setIsEditMode,
    setCurrentProforma
  });

  // Use the proforma loader hook
  const { loadProformaForEdit } = useProformaLoader({
    form,
    setIsLoading,
    setIsEditMode,
    setCurrentProforma,
    setProformaItems
  });

  // Use the printing hook
  const { printRef, triggerPrint } = useProformaPrinting();

  // Use the submission hook
  const { onSubmit } = useProformaSubmission({ 
    form, 
    proformaItems, 
    setCurrentProforma, 
    setShowPrintDialog,
    isEditMode,
    currentProforma,
    loadProformas,
    setIsLoading,
    calculateTotalAmount
  });

  return {
    form,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient,
    handleCreateClient,
    handleSaveClient,
    onSubmit,
    proformas,
    proformaItems,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    calculateTotalAmount,
    printRef,
    showPrintDialog,
    setShowPrintDialog,
    currentProforma,
    triggerPrint,
    resetForm,
    isLoading,
    loadProformas,
    isEditMode,
    loadProformaForEdit
  };
}
