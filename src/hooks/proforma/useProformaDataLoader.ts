
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseProformaDataLoaderProps {
  loadProformas: () => Promise<void>;
}

export function useProformaDataLoader({ loadProformas }: UseProformaDataLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await loadProformas();
      toast({
        title: "Actualiser",
        description: "Les données ont été actualisées",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'actualisation",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    handleRefresh
  };
}
