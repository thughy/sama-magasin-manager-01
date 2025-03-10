
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { useClientsData, NewClient } from "@/hooks/useClientsData";
import { useToast } from "@/components/ui/use-toast";
import { useState, useCallback } from "react";
import { AddClientDialog } from "@/components/clients/AddClientDialog";

const Clients = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredClients,
    clientTypes,
    refreshClients,
    addClient
  } = useClientsData();

  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddClient = () => {
    setIsAddDialogOpen(true);
  };

  const handleSaveClient = useCallback((data: NewClient) => {
    const newClient = addClient(data);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Client ajouté",
      description: `${newClient.name} a été ajouté avec succès.`,
      duration: 3000,
    });
  }, [addClient, toast]);

  const handleRefresh = useCallback(() => {
    refreshClients();
    toast({
      title: "Liste actualisée",
      description: "La liste des clients a été actualisée avec succès.",
      duration: 3000,
    });
  }, [refreshClients, toast]);

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <ClientsHeader 
          onAddClient={handleAddClient} 
          onRefresh={handleRefresh}
        />

        <Card className="p-5">
          <ClientsSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            clientTypes={clientTypes}
          />

          <ClientsTable clients={filteredClients} />
        </Card>
      </div>
      
      <AddClientDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onSave={handleSaveClient}
      />
    </MainLayout>
  );
};

export default Clients;
