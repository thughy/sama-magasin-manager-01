
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Proforma } from "@/components/proforma/ProformasTable";
import { proformaApi } from "@/services/api";
import { useProformaForm } from "@/hooks/useProformaForm";

export function useProformaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const proformaForm = useProformaForm(() => {
    setFormDialogOpen(false);
    handleRefresh(); // Rafraîchir la liste après avoir fermé le formulaire
  });
  const { proformas, loadProformas } = proformaForm;

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast({
        title: "Recherche",
        description: `Recherche de: ${searchTerm}`,
        duration: 3000,
      });
    }
  };

  const handleEditProforma = async (proforma: Proforma) => {
    try {
      const response = await proformaApi.getById(proforma.id);
      if (response.success && response.data) {
        // Logique pour éditer la proforma
        toast({
          title: "Modifier",
          description: `Modification de la proforma: ${proforma.reference}`,
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

  const handleViewProforma = async (proforma: Proforma) => {
    try {
      const response = await proformaApi.getById(proforma.id);
      if (response.success && response.data) {
        // Logique pour voir la proforma
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
        proformaForm.loadProformas(); // Recharger les proformas
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

  useEffect(() => {
    // Chargement initial des proformas
    handleRefresh();
  }, []);

  // Filtrer les proformas selon le terme de recherche
  const filteredProformas = searchTerm.trim() === "" 
    ? proformas 
    : proformas.filter(p => 
        p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return {
    searchTerm,
    setSearchTerm,
    formDialogOpen,
    setFormDialogOpen,
    isLoading,
    proformaForm,
    filteredProformas,
    handleRefresh,
    handleSearch,
    handleEditProforma,
    handleViewProforma,
    handleDeleteProforma
  };
}
