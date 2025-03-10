
import React from "react";
import { Control } from "react-hook-form";

interface ProformaFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reference: string;
  description: string;
  amount: string;
}

interface ProformaDetailsInputsProps {
  control: Control<ProformaFormValues>;
}

export function ProformaDetailsInputs({ control }: ProformaDetailsInputsProps) {
  // Fields removed as requested
  return null;
}
