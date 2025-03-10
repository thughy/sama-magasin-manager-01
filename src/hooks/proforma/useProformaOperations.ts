
import { useToast } from "@/components/ui/use-toast";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";

interface UseProformaOperationsProps {
  loadProformas: () => Promise<void>;
  resetForm: () => void;
  loadProformaForEdit: (proforma: Proforma) => Promise<void>;
  setFormDialogOpen: (open: boolean) => void;
}

export function useProformaOperations({
  loadProformas,
  resetForm,
  loadProformaForEdit,
  setFormDialogOpen
}: UseProformaOperationsProps) {
  const { toast } = useToast();

  const handleEditProforma = async (proforma: Proforma) => {
    resetForm(); // Reset form before loading new data
    try {
      // Open the form in edit mode
      setFormDialogOpen(true);
      // Load proforma data
      await loadProformaForEdit(proforma);
    } catch (error) {
      console.error("Erreur lors du chargement de la proforma:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        duration: 3000,
      });
    }
  };

  const handleViewProforma = async (proforma: Proforma) => {
    try {
      const response = await proformaApi.getById(proforma.id);
      if (response.success && response.data) {
        // Logic for viewing proforma
        toast({
          title: "Voir",
          description: `Affichage de la proforma: ${proforma.reference}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Erreur",
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
    }
  };

  const handleDeleteProforma = async (proforma: Proforma) => {
    try {
      const response = await proformaApi.delete(proforma.id);
      if (response.success) {
        loadProformas(); // Reload proformas
        toast({
          title: "Supprimer",
          description: `Suppression de la proforma: ${proforma.reference}`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de supprimer la proforma",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression",
        duration: 3000,
      });
    }
  };

  return {
    handleEditProforma,
    handleViewProforma,
    handleDeleteProforma
  };
}
