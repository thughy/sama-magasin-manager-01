
import { z } from "zod";

// Form validation schema for Product
export const productSchema = z.object({
  barcode: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  sellPrice: z.coerce.number().min(0, "Le prix doit être positif"),
  purchasePrice: z.coerce.number().min(0, "Le prix doit être positif"),
  category: z.string().min(1, "La catégorie est requise"),
  minStock: z.coerce.number().min(0, "Le stock minimum doit être positif"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
