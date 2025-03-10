
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/data/clientsData";
import { Item } from "@/types/product";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";
import { useProformaState } from "./useProformaState";
import { useClientSelection } from "./useClientSelection";
import { useProformaPrinting } from "./useProformaPrinting";

// Extended type that includes the additional client details needed for printing
interface ProformaWithClientDetails extends Proforma {
  clientEmail?: string;
  clientPhone?: string;
}

export interface ProformaFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reference: string;
  description: string;
  amount: string;
}

export function useProformaForm(onClose: () => void) {
  const { toast } = useToast();
  
  // Import functionality from smaller hooks
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
  } = useProformaState();

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
  } = useClientSelection();

  const { printRef, triggerPrint } = useProformaPrinting();

  // Generate a unique reference for new proformas
  const generateReference = () => `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Initialize the form
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

  // Reset form to initial state
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

  // Load an existing proforma for editing
  const loadProformaForEdit = async (proforma: Proforma) => {
    setIsLoading(true);
    try {
      const response = await proformaApi.getById(proforma.id);
      if (response.success && response.data) {
        const proformaData = response.data;
        
        // Set form values
        form.reset({
          clientName: proformaData.clientName,
          clientEmail: proformaData.clientEmail || "",
          clientPhone: proformaData.clientPhone || "",
          reference: proformaData.reference,
          description: proformaData.description,
          amount: proformaData.amount,
        });
        
        // Set items if available
        if (proformaData.items && Array.isArray(proformaData.items)) {
          setProformaItems(proformaData.items);
        }
        
        // Set edit mode
        setIsEditMode(true);
        setCurrentProforma(proformaData as ProformaWithClientDetails);
        
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

  // Handle client selection and populate form fields
  const handleClientSelect = (client: Client) => {
    const selectedClient = handleSelectClient(client);
    form.setValue("clientName", selectedClient.name);
    form.setValue("clientEmail", selectedClient.email || "");
    form.setValue("clientPhone", selectedClient.phone || "");
  };

  // Form submission handler
  async function onSubmit(data: ProformaFormValues) {
    setIsLoading(true);
    const totalAmount = calculateTotalAmount();
    
    const proformaData: Proforma = {
      id: isEditMode && currentProforma ? currentProforma.id : `PRO-${Date.now()}`,
      reference: data.reference,
      clientName: data.clientName,
      amount: totalAmount.toString(),
      description: data.description,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    try {
      let response;
      
      if (isEditMode) {
        // Update existing proforma
        response = await proformaApi.update({
          ...proformaData,
          items: proformaItems,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone
        });
        
        if (response.success) {
          toast({
            title: "Facture proforma mise à jour",
            description: `Facture ${data.reference} mise à jour pour ${data.clientName}`,
            duration: 3000,
          });
        }
      } else {
        // Create new proforma
        response = await proformaApi.create({
          ...proformaData,
          items: proformaItems,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone
        });
        
        if (response.success) {
          toast({
            title: "Facture proforma créée",
            description: `Facture ${data.reference} créée pour ${data.clientName}`,
            duration: 3000,
          });
        }
      }
      
      if (response && response.success) {
        // Mise à jour de l'état local
        await loadProformas(); // Recharger les proformas depuis l'API
        
        // Sauvegarder les données actuelles pour l'impression
        setCurrentProforma({
          ...proformaData,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone
        } as ProformaWithClientDetails);
        
        // Afficher le dialogue d'impression
        setShowPrintDialog(true);
        
        // On ne réinitialise pas le formulaire ici pour que les données soient disponibles pour l'impression
      } else {
        toast({
          title: "Erreur",
          description: response?.error || "Impossible d'enregistrer la proforma",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Return all the necessary functions and state
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
