
import { useForm } from "react-hook-form";
import { ProformaFormValues } from "@/types/proforma";
import { useProformaSubmission } from "./useProformaSubmission";
import { useProformaClientSelection } from "./useProformaClientSelection";
import { useProformaEditor } from "./useProformaEditor";
import { useProformaPrinting } from "./useProformaPrinting";
import { generateReference } from "@/utils/proformaUtils";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useCallback, useRef } from "react";

export type { ProformaFormValues } from "@/types/proforma";

export function useProformaForm(onClose: () => void) {
  const { toast } = useToast();
  const initialRender = useRef(true);
  
  // Use default form values in a variable to ensure consistency
  const defaultValues = {
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    reference: generateReference(),
    description: "",
    amount: "",
  };
  
  const form = useForm<ProformaFormValues>({
    defaultValues: { ...defaultValues },
  });

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

  const { printRef, triggerPrint } = useProformaPrinting();

  const handleClientSelect = (client: any) => {
    const selectedClient = baseHandleSelectClient(client);
    form.setValue("clientName", selectedClient.name);
    form.setValue("clientEmail", selectedClient.email || "");
    form.setValue("clientPhone", selectedClient.phone || "");
    return selectedClient;
  };
  
  // Improve resetForm to be more thorough
  const resetForm = useCallback(() => {
    console.log("Starting form reset");
    
    // Clear all form state first with a fresh copy of default values
    form.reset({ ...defaultValues }, { keepDefaultValues: true });
    
    // Reset all other state
    setSelectedClient(null);
    setProformaItems([]);
    setSearchTerm("");
    setIsEditMode(false);
    setCurrentProforma(null);
    
    console.log("Form has been completely reset");
  }, [form, setSelectedClient, setProformaItems, setSearchTerm, setIsEditMode, setCurrentProforma]);

  const loadProformaForEdit = async (proforma: Proforma) => {
    console.log("Loading proforma for edit:", proforma.id);
    setIsLoading(true);
    
    try {
      const response = await proformaApi.getById(proforma.id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Impossible de charger la proforma");
      }
      
      const proformaData = response.data;
      console.log("Proforma data loaded:", proformaData);
      
      // First set edit mode and current proforma
      setIsEditMode(true);
      setCurrentProforma(proformaData);
      
      // Prepare form data with explicit values to avoid undefined
      const formData: ProformaFormValues = {
        clientName: proformaData.clientName || "",
        clientEmail: proformaData.clientEmail || "",
        clientPhone: proformaData.clientPhone || "",
        reference: proformaData.reference || "",
        description: proformaData.description || "",
        amount: proformaData.amount?.toString() || "0",
      };
      
      console.log("Setting form values:", formData);
      
      // Set each form field individually to ensure they're all updated
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key as keyof ProformaFormValues, value);
      });
      
      // Set proforma items if available
      if (proformaData.items && Array.isArray(proformaData.items)) {
        console.log("Setting proforma items:", proformaData.items);
        // Use a fresh copy of the items array to ensure reactivity
        setProformaItems([...proformaData.items]);
      } else {
        console.log("No items found in proforma data");
        setProformaItems([]);
      }
      
      toast({
        title: "Proforma chargée",
        description: `La proforma ${proformaData.reference} est prête à être modifiée`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la proforma:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        duration: 3000,
      });
      
      // Reset edit state on error
      setIsEditMode(false);
      setCurrentProforma(null);
    } finally {
      setIsLoading(false);
    }
  };

  // This effect ensures form values are properly set when editing
  useEffect(() => {
    // Skip the first render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    if (isEditMode && currentProforma) {
      console.log("Effect: Updating form values from currentProforma");
      
      // Update form values with a small delay to ensure the form is ready
      setTimeout(() => {
        // Ensure form values are updated when edit mode changes
        form.setValue("clientName", currentProforma.clientName || "");
        form.setValue("clientEmail", currentProforma.clientEmail || "");
        form.setValue("clientPhone", currentProforma.clientPhone || "");
        form.setValue("reference", currentProforma.reference || "");
        form.setValue("description", currentProforma.description || "");
        form.setValue("amount", currentProforma.amount?.toString() || "0");
        
        console.log("Effect: Form values updated");
      }, 50);
    }
  }, [isEditMode, currentProforma, form]);

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
    handleSelectClient: handleClientSelect,
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
