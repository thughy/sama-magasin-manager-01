
import { useToast } from "@/components/ui/use-toast";
import { ProformaFormValues, ProformaWithClientDetails } from "@/types/proforma";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";
import { UseFormReturn } from "react-hook-form";
import { ProformaItem } from "@/components/proforma/proforma-items/ProformaItemsTable";

interface UseProformaSubmissionProps {
  form: UseFormReturn<ProformaFormValues>;
  proformaItems: ProformaItem[];
  setCurrentProforma: (proforma: ProformaWithClientDetails) => void;
  setShowPrintDialog: (show: boolean) => void;
  isEditMode: boolean;
  currentProforma: ProformaWithClientDetails | null;
  loadProformas: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  calculateTotalAmount: () => number;
}

export function useProformaSubmission({ 
  form, 
  proformaItems, 
  setCurrentProforma, 
  setShowPrintDialog,
  isEditMode,
  currentProforma,
  loadProformas,
  setIsLoading,
  calculateTotalAmount
}: UseProformaSubmissionProps) {
  const { toast } = useToast();

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
    onSubmit
  };
}
