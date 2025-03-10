
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@/data/clientsData";
import { useToast } from "@/components/ui/use-toast";
import { useClientsData } from "@/hooks/useClientsData";
import { Proforma } from "@/components/proforma/ProformasTable";
import { Item } from "@/types/product";
import { ProformaItem } from "@/components/proforma/proforma-items/ProformaItemsTable";
import { useReactToPrint } from "react-to-print";
import { proformaApi } from "@/services/api";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Charger les proformas existantes au démarrage
  const loadProformas = async () => {
    setIsLoading(true);
    try {
      const response = await proformaApi.getAll();
      if (response.success && response.data) {
        setProformas(response.data);
      } else {
        toast({
          title: "Erreur de chargement",
          description: response.error || "Impossible de charger les proformas",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des proformas:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Chargement initial
  useEffect(() => {
    loadProformas();
  }, []);
  
  const generateReference = () => `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const form = useForm<ProformaFormValues>({
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: generateReference(),
      description: "",
      amount: "",
    },
  });

  const resetForm = () => {
    setSelectedClient(null);
    setProformaItems([]);
    setSearchTerm("");
    form.reset({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      reference: generateReference(),
      description: "",
      amount: "",
    });
  };

  const handlePrint = useReactToPrint({
    documentTitle: currentProforma ? `Proforma_${currentProforma.reference}` : "Proforma",
    onAfterPrint: () => {
      setShowPrintDialog(false);
      setCurrentProforma(null);
      resetForm();
      // Don't close the form dialog after printing
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 1.5cm;
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

  async function onSubmit(data: ProformaFormValues) {
    setIsLoading(true);
    const totalAmount = calculateTotalAmount();
    
    const newProforma: Proforma = {
      id: `PRO-${Date.now()}`,
      reference: data.reference,
      clientName: data.clientName,
      amount: totalAmount.toString(),
      description: data.description,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    try {
      // Enregistrer dans la base de données via l'API
      const response = await proformaApi.create({
        ...newProforma,
        items: proformaItems,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone
      });
      
      if (response.success) {
        // Mise à jour de l'état local
        await loadProformas(); // Recharger les proformas depuis l'API
        
        toast({
          title: "Facture proforma créée",
          description: `Facture ${data.reference} créée pour ${data.clientName}`,
          duration: 3000,
        });
        
        setCurrentProforma(newProforma);
        setShowPrintDialog(true);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible d'enregistrer la proforma",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
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
    triggerPrint,
    resetForm,
    isLoading,
    loadProformas
  };
}
