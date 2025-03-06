
import { useState } from "react";
import { Supplier } from "@/data/suppliersData";
import { SuppliersSearch } from "./SuppliersSearch";
import { SuppliersTableView } from "./SuppliersTableView";
import { SupplierEditDialog } from "./SupplierEditDialog";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { useToast } from "@/hooks/use-toast";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onUpdateSupplier: (supplier: Supplier) => void;
}

export const SuppliersTable = ({ suppliers, onUpdateSupplier }: SuppliersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setSearchTerm("");
  };

  const openEditDialog = (supplier: Supplier) => {
    setCurrentSupplier({...supplier});
    setEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentSupplier) {
      setCurrentSupplier({
        ...currentSupplier,
        [name]: value,
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSupplier) {
      onUpdateSupplier(currentSupplier);
      
      toast({
        title: "Fournisseur modifié",
        description: `Les informations de ${currentSupplier.name} ont été mises à jour.`,
      });
      
      setEditDialogOpen(false);
    }
  };

  const openPurchaseOrder = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setPurchaseOrderOpen(true);
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const term = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(term) ||
      supplier.contact.toLowerCase().includes(term) ||
      supplier.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <SuppliersSearch 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
      />

      <SuppliersTableView 
        suppliers={filteredSuppliers}
        onEdit={openEditDialog}
        onOpenPurchaseOrder={openPurchaseOrder}
      />

      <SupplierEditDialog 
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        supplier={currentSupplier}
        onInputChange={handleEditInputChange}
        onSubmit={handleEditSubmit}
      />

      {currentSupplier && (
        <PurchaseOrderForm
          supplier={currentSupplier}
          isOpen={purchaseOrderOpen}
          onClose={() => setPurchaseOrderOpen(false)}
        />
      )}
    </div>
  );
};
