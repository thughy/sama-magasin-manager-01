
import React from "react";
import { Card } from "@/components/ui/card";
import { ProformasTable, Proforma } from "@/components/proforma/ProformasTable";
import { ProformaSearchBar } from "./ProformaSearchBar";

interface ProformaListContainerProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  openFormDialog: () => void;
  filteredProformas: Proforma[];
  onEdit: (proforma: Proforma) => void;
  onView: (proforma: Proforma) => void;
  onDelete: (proforma: Proforma) => void;
  isEditing?: boolean; // Add the isEditing prop as optional
}

export const ProformaListContainer: React.FC<ProformaListContainerProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  openFormDialog,
  filteredProformas,
  onEdit,
  onView,
  onDelete,
  isEditing = false // Set a default value of false
}) => {
  return (
    <Card className="p-5">
      <ProformaSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        onCreateNew={openFormDialog}
      />
      <ProformasTable 
        proformas={filteredProformas}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        isEditing={isEditing} // Pass isEditing to the table component
      />
    </Card>
  );
};
