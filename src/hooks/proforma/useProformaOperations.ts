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
      console.log("Starting edit process for proforma:", proforma.id);
      
      // First completely reset the form to clear any previous data
      resetForm();
      console.log("Form reset completed");
      
      // Open the dialog - this is important to happen BEFORE loading data
      setFormDialogOpen(true);
      
      // Add a delay to ensure the dialog is fully open and form state is reset
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get the full proforma data
      console.log("Fetching proforma data for:", proforma.id);
      const response = await proformaApi.getById(proforma.id);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "Impossible de charger la proforma");
      }
      
      // Add another small delay to ensure form is ready to receive data
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now load the proforma data for editing - after dialog is open and form is reset
      await loadProformaForEdit(response.data);
      
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
      // Delay setting isEditing to false to ensure all operations are complete
      setTimeout(() => {
        setIsEditing(false);
        console.log("Edit process completed");
      }, 300);
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
