
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierSelector } from "@/components/suppliers/payments/SupplierSelector";
import { SupplierInfo } from "@/components/suppliers/payments/SupplierInfo";
import { PurchaseList } from "@/components/suppliers/payments/PurchaseList";
import { PaymentDialog } from "@/components/suppliers/payments/PaymentDialog";
import { useSupplierPayments } from "@/hooks/useSupplierPayments";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PurchaseForm } from "@/components/suppliers/purchases/PurchaseForm";
import { PaymentHistoryDialog } from "@/components/suppliers/payments/PaymentHistoryDialog";

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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Paiement Fournisseur</h1>
          <p className="text-muted-foreground">
            Gérez tous les paiements effectués à vos fournisseurs
          </p>
        </div>

        {/* Error state */}
        {!isLoading && suppliers.length === 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              Impossible de charger les données des fournisseurs. Veuillez rafraîchir la page.
            </AlertDescription>
          </Alert>
        )}

        {/* Supplier selection card */}
        <Card>
          <CardHeader>
            <CardTitle>Sélection du fournisseur</CardTitle>
            <CardDescription>
              Sélectionnez un fournisseur pour voir ses factures impayées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <SupplierSelector 
                suppliers={suppliers}
                selectedSupplier={selectedSupplier}
                onSupplierSelect={handleSupplierSelect}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Supplier info and purchases list */}
        {selectedSupplier && (
          <div className="space-y-6">
            <SupplierInfo supplier={selectedSupplier} />
            <PurchaseList 
              purchases={supplierPurchases || []}
              onPaymentClick={handlePaymentClick}
              onEditClick={handleEditPurchase}
              onViewHistory={handleViewPaymentHistory}
              supplier={selectedSupplier} // Pass the supplier data to PurchaseList
            />
          </div>
        )}

        {/* Payment dialog */}
        {selectedPurchase && (
          <PaymentDialog
            purchase={selectedPurchase}
            open={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
            paymentAmount={paymentAmount}
            onPaymentAmountChange={setPaymentAmount}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            paymentDate={paymentDate}
            onPaymentDateChange={setPaymentDate}
            onSubmit={handlePaymentSubmit}
          />
        )}

        {/* Purchase Edit Form */}
        {selectedPurchase && (
          <PurchaseForm
            isOpen={isPurchaseFormOpen}
            onClose={() => setIsPurchaseFormOpen(false)}
            initialPurchase={selectedPurchase}
            onSave={handleSavePurchase}
          />
        )}

        {/* Payment History Dialog */}
        {selectedPurchase && (
          <PaymentHistoryDialog
            purchase={selectedPurchase}
            open={isPaymentHistoryOpen}
            onOpenChange={setIsPaymentHistoryOpen}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default SupplierPayments;
