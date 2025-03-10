
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProformaFormValues } from "@/types/proforma";

interface UseProformaFormResetProps {
  form: UseFormReturn<ProformaFormValues>;
  defaultValues: ProformaFormValues;
  setSelectedClient: (client: any) => void;
  setProformaItems: (items: any[]) => void;
  setSearchTerm: (term: string) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  setCurrentProforma: (proforma: any) => void;
}

export function useProformaFormReset({
  form,
  defaultValues,
  setSelectedClient,
  setProformaItems,
  setSearchTerm,
  setIsEditMode,
  setCurrentProforma
}: UseProformaFormResetProps) {
  
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
  }, [form, defaultValues, setSelectedClient, setProformaItems, setSearchTerm, setIsEditMode, setCurrentProforma]);

  return { resetForm };
}
