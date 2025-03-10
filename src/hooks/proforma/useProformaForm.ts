
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
import { useEffect } from "react";

export type { ProformaFormValues } from "@/types/proforma";

export function useProformaForm(onClose: () => void) {
  const { toast } = useToast();
  const form = useForm<ProformaFormValues>({
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: generateReference(),
      description: "",
      amount: "",
    },
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
  
  const resetForm = () => {
    // Clear form state first
    form.reset({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: generateReference(),
      description: "",
      amount: "",
    }, { keepDefaultValues: false });
    
    // Reset all other state
    setSelectedClient(null);
    setProformaItems([]);
    setSearchTerm("");
    setIsEditMode(false);
    setCurrentProforma(null);
    
    console.log("Form has been completely reset");
  };

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
      
      // Then update form values - use a separate variable to ensure the values are updated
      const formData = {
        clientName: proformaData.clientName || "",
        clientEmail: proformaData.clientEmail || "",
        clientPhone: proformaData.clientPhone || "",
        reference: proformaData.reference || "",
        description: proformaData.description || "",
        amount: proformaData.amount?.toString() || "0",
      };
      
      console.log("Setting form values:", formData);
      
      // Use form.reset to completely replace all values
      form.reset(formData, { keepDefaultValues: false });
      
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
    if (isEditMode && currentProforma) {
      // Ensure form values are updated when edit mode changes
      form.reset({
        clientName: currentProforma.clientName || "",
        clientEmail: currentProforma.clientEmail || "",
        clientPhone: currentProforma.clientPhone || "",
        reference: currentProforma.reference || "",
        description: currentProforma.description || "",
        amount: currentProforma.amount?.toString() || "0",
      }, { keepDefaultValues: false });
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
