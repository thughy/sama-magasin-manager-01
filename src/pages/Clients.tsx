
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { useClientsData } from "@/hooks/useClientsData";

const Clients = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredClients,
    clientTypes
  } = useClientsData();

  const handleAddClient = () => {
    // Function to handle adding a new client
    console.log("Adding a new client");
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <ClientsHeader onAddClient={handleAddClient} />

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
    </MainLayout>
  );
};

export default Clients;
