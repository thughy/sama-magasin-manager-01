
import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProforma = async (proforma: Proforma) => {
    if (isEditing) return; // Prevent multiple clicks while processing
    
    try {
      // Start the editing process
      setIsEditing(true);
      
      // Get the full proforma data first
      const response = await proformaApi.getById(proforma.id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Impossible de charger la proforma");
      }
      
      // Complete reset of form state
      resetForm();
      
      // Open dialog and wait for it to be fully rendered
      setFormDialogOpen(true);
      
      // Use a more substantial delay to ensure the dialog is fully rendered
      // and form state is completely reset
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Now load the proforma data for editing
      await loadProformaForEdit(proforma);
      
      toast({
        title: "Modification",
        description: `Modification de la proforma: ${proforma.reference}`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la proforma pour édition:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        duration: 3000,
      });
      // Close the form dialog if there's an error
      setFormDialogOpen(false);
    } finally {
      setIsEditing(false);
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
        await loadProformas(); // Reload proformas
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
    handleDeleteProforma,
    isEditing
  };
}
