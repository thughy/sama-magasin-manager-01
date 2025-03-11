
import { MainLayout } from "@/components/layout/MainLayout";
import { InvoiceDialog } from "@/components/invoicing/InvoiceDialog";
import { ClientInvoicingHeader } from "@/components/invoicing/ClientInvoicingHeader";
import { InvoiceList } from "@/components/invoicing/InvoiceList";
import { useInvoicingData } from "@/hooks/invoicing/useInvoicingData";

const ClientInvoicing = () => {
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

  console.log("ClientInvoicing render, dialog open:", isInvoiceDialogOpen);

  return (
    <MainLayout>
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

      <InvoiceDialog
        open={isInvoiceDialogOpen}
        onOpenChange={setIsInvoiceDialogOpen}
        invoice={selectedInvoice}
        onSave={handleInvoiceSave}
      />
    </MainLayout>
  );
};

export default ClientInvoicing;
