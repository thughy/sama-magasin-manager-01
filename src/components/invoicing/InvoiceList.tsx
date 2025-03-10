
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Invoice } from "@/services/api";
import { EmptyInvoiceState } from "./EmptyInvoiceState";
import { createInvoiceColumns } from "./invoiceColumns";

interface InvoiceListProps {
  invoices: Invoice[];
  onEditInvoice: (invoice: Invoice) => void;
  onNewInvoice: () => void;
}

export const InvoiceList = ({ 
  invoices, 
  onEditInvoice, 
  onNewInvoice 
}: InvoiceListProps) => {
  const columns = createInvoiceColumns(onEditInvoice);

  return (
    <Card className="p-5">
      {invoices.length === 0 ? (
        <EmptyInvoiceState onNewInvoice={onNewInvoice} />
      ) : (
        <DataTable columns={columns} data={invoices} />
      )}
    </Card>
  );
};
