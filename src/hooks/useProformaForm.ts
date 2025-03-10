
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@/data/clientsData";
import { useToast } from "@/components/ui/use-toast";
import { useClientsData } from "@/hooks/useClientsData";
import { Proforma } from "@/components/proforma/ProformasTable";
import { Item } from "@/types/product";
import { ProformaItem } from "@/components/proforma/proforma-items/ProformaItemsTable";
import { useReactToPrint } from "react-to-print";

export interface ProformaFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  reference: string;
  description: string;
  amount: string;
}

export function useProformaForm(onClose: () => void) {
  const { toast } = useToast();
  const { addClient } = useClientsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [proformaItems, setProformaItems] = useState<ProformaItem[]>([]);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [currentProforma, setCurrentProforma] = useState<Proforma | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<ProformaFormValues>({
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      description: "",
      amount: "",
    },
  });

  const handlePrint = useReactToPrint({
    documentTitle: currentProforma ? `Proforma_${currentProforma.reference}` : "Proforma",
    onAfterPrint: () => {
      setShowPrintDialog(false);
      setCurrentProforma(null);
      onClose();
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 1.5cm;
        @bottom-right {
          content: "Page " counter(page) " sur " counter(pages);
        }
      }
    `,
    contentRef: printRef,
  });

  const triggerPrint = () => {
    if (printRef.current) {
      handlePrint();
    }
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    form.setValue("clientName", client.name);
    form.setValue("clientEmail", client.email || "");
    form.setValue("clientPhone", client.phone || "");
    setSearchTerm("");
  };

  const handleCreateClient = () => {
    setClientDialogOpen(true);
  };

  const handleSaveClient = (data: { name: string; phone: string; email?: string; address?: string }) => {
    const newClient = addClient({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address
    });
    
    handleSelectClient(newClient);
  };

  const handleAddItem = (item: Item) => {
    const newItem: ProformaItem = {
      id: `item-${Date.now()}`,
      name: item.name,
      type: item.type,
      quantity: 1,
      unitPrice: item.type === "product" ? item.sellPrice : item.amount,
    };
    
    setProformaItems([...proformaItems, newItem]);
  };

  const handleUpdateItem = (id: string, field: string, value: string | number) => {
    setProformaItems(
      proformaItems.map((item) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setProformaItems(proformaItems.filter((item) => item.id !== id));
  };

  const calculateTotalAmount = () => {
    return proformaItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  function onSubmit(data: ProformaFormValues) {
    const totalAmount = calculateTotalAmount();
    
    const newProforma: Proforma = {
      id: `PRO-${proformas.length + 1}`,
      reference: data.reference,
      clientName: data.clientName,
      amount: totalAmount.toString(),
      description: data.description,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    setProformas([...proformas, newProforma]);
    
    toast({
      title: "Facture proforma créée",
      description: `Facture ${data.reference} créée pour ${data.clientName}`,
      duration: 3000,
    });
    
    setCurrentProforma(newProforma);
    
    setShowPrintDialog(true);
  }

  return {
    form,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    clientDialogOpen,
    setClientDialogOpen,
    handleSelectClient,
    handleCreateClient,
    handleSaveClient,
    onSubmit,
    proformas,
    proformaItems,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    calculateTotalAmount,
    printRef,
    showPrintDialog,
    setShowPrintDialog,
    currentProforma,
    triggerPrint
  };
}
