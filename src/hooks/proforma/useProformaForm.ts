
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
    setSelectedClient(null);
    setProformaItems([]);
    setSearchTerm("");
    setIsEditMode(false);
    form.reset({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: generateReference(),
      description: "",
      amount: "",
    });
  };

  const loadProformaForEdit = async (proforma: Proforma) => {
    setIsLoading(true);
    try {
      const response = await proformaApi.getById(proforma.id);
      if (response.success && response.data) {
        const proformaData = response.data;
        
        form.reset({
          clientName: proformaData.clientName,
          clientEmail: proformaData.clientEmail || "",
          clientPhone: proformaData.clientPhone || "",
          reference: proformaData.reference,
          description: proformaData.description,
          amount: proformaData.amount,
        });
        
        if (proformaData.items && Array.isArray(proformaData.items)) {
          setProformaItems(proformaData.items);
        }
        
        setIsEditMode(true);
        setCurrentProforma(proformaData);
        
        toast({
          title: "Proforma chargée",
          description: `La proforma ${proformaData.reference} est prête à être modifiée`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Erreur de chargement",
          description: response.error || "Impossible de charger la proforma",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la proforma:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
