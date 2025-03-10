
import { useForm } from "react-hook-form";
import { ProformaFormValues } from "@/types/proforma";
import { generateReference } from "@/utils/proformaUtils";
import { useEffect, useRef } from "react";

export function useProformaFormState(isEditMode: boolean, currentProforma: any) {
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

  return {
    form,
    defaultValues
  };
}
