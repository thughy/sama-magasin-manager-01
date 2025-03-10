
import { Proforma } from "@/components/proforma/ProformasTable";
import { Item } from "@/types/product";

export interface ProformaWithClientDetails extends Proforma {
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
