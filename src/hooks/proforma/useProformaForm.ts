
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/data/clientsData";
import { Item } from "@/types/product";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";
import { useProformaState } from "./useProformaState";
import { useClientSelection } from "./useClientSelection";
import { useProformaPrinting } from "./useProformaPrinting";

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

  const generateReference = () => `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
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

  const handleClientSelect = (client: Client) => {
    const selectedClient = handleSelectClient(client);
    form.setValue("clientName", selectedClient.name);
    form.setValue("clientEmail", selectedClient.email || "");
    form.setValue("clientPhone", selectedClient.phone || "");
  };

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
        await loadProformas();
        
        const proformaWithDetails: ProformaWithClientDetails = {
          ...proformaData,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone
        };
        
        // Fix: Only passing one argument when it expects two
        setCurrentProforma(proformaWithDetails);
        setShowPrintDialog(true);
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
