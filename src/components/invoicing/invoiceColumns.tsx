
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { Invoice } from "@/services/api";

export const createInvoiceColumns = (onEditInvoice: (invoice: Invoice) => void): ColumnDef<Invoice>[] => [
  {
    accessorKey: "reference",
    header: "Référence",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "clientName",
    header: "Client",
  },
  {
    accessorKey: "totalAmount",
    header: "Montant total",
    cell: ({ row }) => {
      return <span>{row.original.totalAmount?.toLocaleString()} FCFA</span>;
    },
  },
  {
    accessorKey: "amountPaid",
    header: "Montant payé",
    cell: ({ row }) => {
      return <span>{row.original.amountPaid?.toLocaleString()} FCFA</span>;
    },
  },
  {
    accessorKey: "balance",
    header: "Solde",
    cell: ({ row }) => {
      return <span>{row.original.balance?.toLocaleString()} FCFA</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className={
          status === 'paid' ? 'text-green-600 font-medium' : 
          status === 'partial' ? 'text-orange-500 font-medium' : 
          'text-red-500 font-medium'
        }>
          {status === 'paid' ? 'Payée' : 
           status === 'partial' ? 'Partiel' : 'Non payée'}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEditInvoice(row.original)}
            title="Modifier"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Print invoice", row.original.id)}
            title="Imprimer"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
