
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const ClientProforma = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Actualiser",
      description: "Les données ont été actualisées",
      duration: 3000,
    });
  };

  const handleNewProforma = () => {
    toast({
      title: "Nouveau proforma",
      description: "Création d'un nouveau proforma",
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
            <Button className="bg-sama-600 hover:bg-sama-700" onClick={handleNewProforma}>
              <Plus size={16} className="mr-2" />
              Nouveau
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
          </form>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">Aucun document proforma trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Créez un nouveau document proforma en cliquant sur le bouton "Nouveau"
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClientProforma;
