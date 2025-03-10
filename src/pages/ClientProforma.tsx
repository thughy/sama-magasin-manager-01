
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProformaFormDialog } from "@/components/proforma/ProformaFormDialog";
import { ProformaPageHeader } from "@/components/proforma/ProformaPageHeader";
import { ProformaListContainer } from "@/components/proforma/ProformaListContainer";
import { useProformaPage } from "@/hooks/useProformaPage";

const ClientProforma = () => {
  const {
    searchTerm,
    setSearchTerm,
    formDialogOpen,
    setFormDialogOpen,
    isLoading,
    filteredProformas,
    handleRefresh,
    handleSearch,
    handleEditProforma,
    handleViewProforma,
    handleDeleteProforma
  } = useProformaPage();

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <ProformaPageHeader 
          isLoading={isLoading} 
          onRefresh={handleRefresh} 
        />

        <ProformaListContainer 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          openFormDialog={() => setFormDialogOpen(true)}
          filteredProformas={filteredProformas}
          onEdit={handleEditProforma}
          onView={handleViewProforma}
          onDelete={handleDeleteProforma}
        />
      </div>
      
      <ProformaFormDialog 
        open={formDialogOpen} 
        onOpenChange={setFormDialogOpen} 
      />
    </MainLayout>
  );
};

export default ClientProforma;
