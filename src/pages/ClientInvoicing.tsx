
import { MainLayout } from "@/components/layout/MainLayout";
import { InvoiceDialog } from "@/components/invoicing/InvoiceDialog";
import { ClientInvoicingHeader } from "@/components/invoicing/ClientInvoicingHeader";
import { InvoiceList } from "@/components/invoicing/InvoiceList";
import { useInvoicingData } from "@/hooks/invoicing/useInvoicingData";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";

const ClientInvoicing = () => {
  const methods = useForm();
  
  const {
    invoices,
    isLoading,
    isInvoiceDialogOpen,
    setIsInvoiceDialogOpen,
    selectedInvoice,
    handleRefresh,
    handleNewInvoice,
    handleEditInvoice,
    handleInvoiceSave,
  } = useInvoicingData();

  return (
    <MainLayout>
      <FormProvider {...methods}>
        <div className="space-y-6 animate-scale-in">
          {/* Header */}
          <ClientInvoicingHeader
            isLoading={isLoading}
            onRefresh={handleRefresh}
            onNewInvoice={handleNewInvoice}
          />

          {/* Content */}
          <InvoiceList
            invoices={invoices}
            onEditInvoice={handleEditInvoice}
            onNewInvoice={handleNewInvoice}
          />
        </div>

        {isInvoiceDialogOpen && (
          <InvoiceDialog
            open={isInvoiceDialogOpen}
            onOpenChange={setIsInvoiceDialogOpen}
            invoice={selectedInvoice}
            onSave={handleInvoiceSave}
          />
        )}
      </FormProvider>
    </MainLayout>
  );
};

export default ClientInvoicing;
