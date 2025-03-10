
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { invoicingApi, Invoice } from "@/services/api";

export const useInvoicingData = () => {
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

  return {
    invoices,
    isLoading,
    isInvoiceDialogOpen,
    setIsInvoiceDialogOpen,
    selectedInvoice,
    handleRefresh,
    handleNewInvoice,
    handleEditInvoice,
    handleInvoiceSave,
  };
};
