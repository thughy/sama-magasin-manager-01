
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProformaFormDialog } from "@/components/proforma/ProformaFormDialog";

const ClientProforma = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Actualiser",
      description: "Les données ont été actualisées",
      duration: 3000,
    });
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
            >
              <RefreshCw size={16} className="mr-2" />
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

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">Aucun document proforma trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              La liste des proformas s'affichera ici
            </p>
          </div>
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
