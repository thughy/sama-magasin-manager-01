
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProformaFormDialog } from "@/components/proforma/ProformaFormDialog";
import { ProformasTable } from "@/components/proforma/ProformasTable";
import { useProformaForm } from "@/hooks/useProformaForm";
import { proformaApi } from "@/services/api";

const ClientProforma = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const proformaForm = useProformaForm(() => setFormDialogOpen(false));
  const { proformas } = proformaForm;

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await proformaApi.getAll();
      if (response.success && response.data) {
        proformaForm.loadProformas();
        toast({
          title: "Actualiser",
          description: "Les données ont été actualisées",
          duration: 3000,
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de charger les données",
          duration: 3000,
        });
      }
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

  const handleEditProforma = async (proforma: any) => {
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

  const handleViewProforma = async (proforma: any) => {
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

  const handleDeleteProforma = async (proforma: any) => {
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

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Proforma</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos documents proforma pour vos clients
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        <Card className="p-5">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher un proforma..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Rechercher</Button>
            <Button 
              type="button" 
              onClick={() => setFormDialogOpen(true)} 
              className="flex items-center gap-2"
            >
              <Save size={18} />
              Enregistrer
            </Button>
          </form>

          <ProformasTable 
            proformas={proformas}
            onEdit={handleEditProforma}
            onView={handleViewProforma}
            onDelete={handleDeleteProforma}
          />
        </Card>
      </div>
      
      <ProformaFormDialog 
        open={formDialogOpen} 
        onOpenChange={setFormDialogOpen} 
      />
    </MainLayout>
  );
};

export default ClientProforma;
