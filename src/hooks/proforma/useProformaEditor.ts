
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Proforma } from "@/components/proforma/ProformasTable";
import { ProformaItem } from "@/components/proforma/proforma-items/ProformaItemsTable";
import { proformaApi } from "@/services/api";
import { ProformaWithClientDetails } from "@/types/proforma";

export function useProformaEditor() {
  const { toast } = useToast();
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [proformaItems, setProformaItems] = useState<ProformaItem[]>([]);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [currentProforma, setCurrentProforma] = useState<ProformaWithClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Charger les proformas existantes
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

  // Handlers for proforma items
  const handleAddItem = (item: any) => {
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

  return {
    proformas,
    setProformas,
    proformaItems,
    setProformaItems,
    showPrintDialog,
    setShowPrintDialog,
    currentProforma,
    setCurrentProforma,
    isLoading,
    setIsLoading,
    isEditMode,
    setIsEditMode,
    loadProformas,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    calculateTotalAmount
  };
}
