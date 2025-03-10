
import { proformaApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Proforma } from "@/components/proforma/ProformasTable";
import { UseFormReturn } from "react-hook-form";
import { ProformaFormValues } from "@/types/proforma";

interface UseProformaLoaderProps {
  form: UseFormReturn<ProformaFormValues>;
  setIsLoading: (isLoading: boolean) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setCurrentProforma: (proforma: any) => void;
  setProformaItems: (items: any[]) => void;
}

export function useProformaLoader({
  form,
  setIsLoading,
  setIsEditMode,
  setCurrentProforma,
  setProformaItems
}: UseProformaLoaderProps) {
  const { toast } = useToast();

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

  return { loadProformaForEdit };
}
