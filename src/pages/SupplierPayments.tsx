
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useSupplierPayments } from "@/hooks/useSupplierPayments";
import { PaymentsHeader } from "@/components/suppliers/payments/PaymentsHeader";
import { ErrorAlert } from "@/components/suppliers/payments/ErrorAlert";
import { SupplierSelectionCard } from "@/components/suppliers/payments/SupplierSelectionCard";
import { SupplierContent } from "@/components/suppliers/payments/SupplierContent";
import { PaymentDialogs } from "@/components/suppliers/payments/PaymentDialogs";

const SupplierPayments = () => {
  const {
    suppliers,
    selectedSupplier,
    supplierPurchases,
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    selectedPurchase,
    paymentAmount,
    setPaymentAmount,
    paymentMethod,
    setPaymentMethod,
    paymentDate,
    setPaymentDate,
    handleSupplierSelect,
    handlePaymentClick,
    handlePaymentSubmit,
    isLoading,
    isPurchaseFormOpen,
    setIsPurchaseFormOpen,
    handleEditPurchase,
    handleSavePurchase,
    isPaymentHistoryOpen,
    setIsPaymentHistoryOpen,
    handleViewPaymentHistory
  } = useSupplierPayments();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <PaymentsHeader 
          title="Paiement Fournisseur" 
          description="Gérez tous les paiements effectués à vos fournisseurs" 
        />

        {/* Error state */}
        {!isLoading && suppliers.length === 0 && (
          <ErrorAlert 
            title="Erreur de chargement" 
            description="Impossible de charger les données des fournisseurs. Veuillez rafraîchir la page." 
          />
        )}

        {/* Supplier selection card */}
        <SupplierSelectionCard
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          onSupplierSelect={handleSupplierSelect}
          isLoading={isLoading}
        />

        {/* Supplier info and purchases list */}
        {selectedSupplier && (
          <SupplierContent
            supplier={selectedSupplier}
            purchases={supplierPurchases}
            onPaymentClick={handlePaymentClick}
            onEditClick={handleEditPurchase}
            onViewHistory={handleViewPaymentHistory}
          />
        )}

        {/* All Dialogs */}
        <PaymentDialogs
          selectedPurchase={selectedPurchase}
          isPaymentDialogOpen={isPaymentDialogOpen}
          setIsPaymentDialogOpen={setIsPaymentDialogOpen}
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          onPaymentSubmit={handlePaymentSubmit}
          isPurchaseFormOpen={isPurchaseFormOpen}
          setIsPurchaseFormOpen={setIsPurchaseFormOpen}
          onSavePurchase={handleSavePurchase}
          isPaymentHistoryOpen={isPaymentHistoryOpen}
          setIsPaymentHistoryOpen={setIsPaymentHistoryOpen}
        />
      </div>
    </MainLayout>
  );
};

export default SupplierPayments;
