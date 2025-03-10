
import { useState, useEffect } from "react";
import { useProformaForm } from "@/hooks/useProformaForm";
import { useProformaSearch } from "@/hooks/proforma/useProformaSearch";
import { useProformaOperations } from "@/hooks/proforma/useProformaOperations";
import { useProformaDataLoader } from "@/hooks/proforma/useProformaDataLoader";

export function useProformaPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  
  // Initialize the proforma form hook with a callback
  const proformaForm = useProformaForm(() => {
    setFormDialogOpen(false);
    handleRefresh(); // Refresh list after closing the form
  });
  
  const { proformas, loadProformas, loadProformaForEdit, resetForm } = proformaForm;
  
  // Initialize the data loader hook
  const { 
    isLoading, 
    handleRefresh 
  } = useProformaDataLoader({ loadProformas });
  
  // Initialize the search hook
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredProformas, 
    handleSearch 
  } = useProformaSearch(proformas);
  
  // Initialize the operations hook
  const { 
    handleEditProforma, 
    handleViewProforma, 
    handleDeleteProforma,
    isEditing
  } = useProformaOperations({
    loadProformas,
    resetForm,
    loadProformaForEdit,
    setFormDialogOpen
  });

  // Load proformas on initial render
  useEffect(() => {
    handleRefresh();
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    formDialogOpen,
    setFormDialogOpen,
    isLoading,
    isEditing,
    proformaForm,
    filteredProformas,
    handleRefresh,
    handleSearch,
    handleEditProforma,
    handleViewProforma,
    handleDeleteProforma
  };
}
