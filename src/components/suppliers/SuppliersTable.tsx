import { useState } from "react";
import { Supplier } from "@/data/suppliersData";
import { SuppliersSearch } from "./SuppliersSearch";
import { SuppliersTableView } from "./SuppliersTableView";
import { SupplierEditDialog } from "./SupplierEditDialog";
import { PurchaseOrderForm } from "./PurchaseOrderForm";

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export const SuppliersTable = ({ suppliers: initialSuppliers }: SuppliersTableProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setSuppliers(initialSuppliers);
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
      setSuppliers(suppliers.map(supplier => 
        supplier.id === currentSupplier.id ? currentSupplier : supplier
      ));
      
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
