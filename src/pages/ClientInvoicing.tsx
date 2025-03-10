
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Receipt, FileText, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { invoicingApi, Invoice, clientApi } from "@/services/api";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceDialog } from "@/components/invoicing/InvoiceDialog";

const ClientInvoicing = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Fetch invoices on initial load
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await invoicingApi.getAll();
      if (response.success && response.data) {
        setInvoices(response.data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les factures.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des factures.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchInvoices();
  };

  const handleNewInvoice = () => {
    setSelectedInvoice(null);
    setIsInvoiceDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDialogOpen(true);
  };

  const handleInvoiceSave = async (invoice: Partial<Invoice> & { id?: string }) => {
    setIsLoading(true);
    try {
      let response;
      if (invoice.id) {
        // Update existing invoice
        response = await invoicingApi.update(invoice.id, invoice);
      } else {
        // Create new invoice
        const newInvoice = {
          ...invoice,
          depot: "Principal", // Setting the main depot as requested
          status: invoice.amountPaid === 0 ? 'unpaid' : 
                 invoice.amountPaid < invoice.totalAmount ? 'partial' : 'paid',
        } as Omit<Invoice, 'id'>;
        
        response = await invoicingApi.create(newInvoice);
      }

      if (response.success && response.data) {
        fetchInvoices();
        setIsInvoiceDialogOpen(false);
        toast({
          title: "Succès",
          description: invoice.id ? "Facture mise à jour avec succès." : "Facture créée avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la facture.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Invoice>[] = [
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
              onClick={() => handleEditInvoice(row.original)}
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

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Facturation</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les factures clients et suivez les paiements
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Actualiser
            </Button>
            <Button size="sm" onClick={handleNewInvoice}>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle facture
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="p-5">
          {invoices.length === 0 ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 gap-4">
              <Receipt className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Module de facturation</h3>
              <p className="text-muted-foreground max-w-md">
                Ce module vous permet de créer et gérer les factures clients, de suivre les paiements et de générer des rapports.
              </p>
              <Button className="mt-2" onClick={handleNewInvoice}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une facture
              </Button>
            </div>
          ) : (
            <DataTable columns={columns} data={invoices} />
          )}
        </Card>
      </div>

      {isInvoiceDialogOpen && (
        <InvoiceDialog
          open={isInvoiceDialogOpen}
          onOpenChange={setIsInvoiceDialogOpen}
          invoice={selectedInvoice}
          onSave={handleInvoiceSave}
        />
      )}
    </MainLayout>
  );
};

export default ClientInvoicing;
