
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/data/clientsData";
import { Item } from "@/types/product";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";
import { useProformaState } from "./useProformaState";
import { useClientSelection } from "./useClientSelection";
import { useProformaPrinting } from "./useProformaPrinting";

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
    form.reset({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: generateReference(),
      description: "",
      amount: "",
    });
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
    
    const newProforma: Proforma = {
      id: `PRO-${Date.now()}`,
      reference: data.reference,
      clientName: data.clientName,
      amount: totalAmount.toString(),
      description: data.description,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    try {
      // Enregistrer dans la base de données via l'API
      const response = await proformaApi.create({
        ...newProforma,
        items: proformaItems,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone
      });
      
      if (response.success) {
        // Mise à jour de l'état local
        await loadProformas(); // Recharger les proformas depuis l'API
        
        toast({
          title: "Facture proforma créée",
          description: `Facture ${data.reference} créée pour ${data.clientName}`,
          duration: 3000,
        });
        
        setCurrentProforma(newProforma);
        setShowPrintDialog(true);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible d'enregistrer la proforma",
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
    loadProformas
  };
}
