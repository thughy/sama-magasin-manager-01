
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierSelector } from "@/components/suppliers/payments/SupplierSelector";
import { SupplierInfo } from "@/components/suppliers/payments/SupplierInfo";
import { PurchaseList } from "@/components/suppliers/payments/PurchaseList";
import { PaymentDialog } from "@/components/suppliers/payments/PaymentDialog";
import { useSupplierPayments } from "@/hooks/useSupplierPayments";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    handleSupplierSelect,
    handlePaymentClick,
    handlePaymentSubmit,
    isLoading
  } = useSupplierPayments();

  // Add logging to debug the component
  useEffect(() => {
    console.log("SupplierPayments component mounted");
    console.log("Suppliers loaded:", suppliers);
  }, [suppliers]);

  useEffect(() => {
    console.log("Selected supplier changed:", selectedSupplier);
  }, [selectedSupplier]);

  // Always make sure suppliers is an array
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  if (safeSuppliers.length === 0 && !isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Paiement Fournisseur</h1>
            <p className="text-muted-foreground">
              Gérez tous les paiements effectués à vos fournisseurs
            </p>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              Impossible de charger les données des fournisseurs. Veuillez rafraîchir la page.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Paiement Fournisseur</h1>
          <p className="text-muted-foreground">
            Gérez tous les paiements effectués à vos fournisseurs
          </p>
        </div>

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
                suppliers={safeSuppliers}
                selectedSupplier={selectedSupplier}
                onSupplierSelect={handleSupplierSelect}
              />
            )}
          </CardContent>
        </Card>

        {selectedSupplier && (
          <div className="space-y-6">
            <SupplierInfo supplier={selectedSupplier} />
            <PurchaseList 
              purchases={supplierPurchases || []}
              onPaymentClick={handlePaymentClick}
            />
          </div>
        )}

        {selectedPurchase && (
          <PaymentDialog
            purchase={selectedPurchase}
            open={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
            paymentAmount={paymentAmount}
            onPaymentAmountChange={setPaymentAmount}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onSubmit={handlePaymentSubmit}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default SupplierPayments;
