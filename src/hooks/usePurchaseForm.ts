
import { useState, useEffect, useRef } from 'react';
import { Purchase, PaymentMethod, PurchaseItem } from '@/types/purchase';
import { Supplier } from '@/data/suppliersData';
import { useToast } from '@/hooks/use-toast';

interface UsePurchaseFormProps {
  initialPurchase?: Purchase;
  onSave: (purchase: Purchase) => void;
  onClose: () => void;
}

export const usePurchaseForm = ({ initialPurchase, onSave, onClose }: UsePurchaseFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<Purchase, 'id'> & { id?: string }>({
    reference: `F-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    purchaseDate: new Date().toISOString().split('T')[0],
    supplierId: 0,
    supplierName: '',
    productName: '',
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    totalPaid: 0,
    balance: 0,
    status: 'impayée',
    paymentMethods: []
  });
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Function to update inventory in localStorage (simulated database)
  const updateInventory = (items: PurchaseItem[]) => {
    try {
      // Get current inventory from localStorage
      const inventoryString = localStorage.getItem('inventory');
      const inventory = inventoryString ? JSON.parse(inventoryString) : [];
      
      // Update inventory with new items
      items.forEach(item => {
        const existingItemIndex = inventory.findIndex(
          (invItem: any) => invItem.id === item.productId && invItem.depot === item.depot
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          inventory[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new inventory item
          inventory.push({
            id: item.productId,
            name: item.productName,
            quantity: item.quantity,
            purchasePrice: item.unitPrice,
            sellPrice: item.sellPrice || 0,
            depot: item.depot
          });
        }
      });
      
      // Save updated inventory back to localStorage
      localStorage.setItem('inventory', JSON.stringify(inventory));
      
      return true;
    } catch (error) {
      console.error('Error updating inventory:', error);
      return false;
    }
  };
  
  // Function to print depot entry receipts
  const printDepotEntry = (depotName: string) => {
    if (depotName === 'all') {
      // Get all unique depots
      const uniqueDepots = [...new Set(purchaseItems.map(item => item.depot))].filter(Boolean);
      
      // Print for each depot
      uniqueDepots.forEach(depot => {
        if (depot) printSingleDepotEntry(depot);
      });
    } else {
      printSingleDepotEntry(depotName);
    }
  };
  
  // Function to print a single depot entry receipt
  const printSingleDepotEntry = (depotName: string) => {
    // Filter items for this depot
    const depotItems = purchaseItems.filter(item => item.depot === depotName);
    
    if (depotItems.length === 0) {
      toast({
        title: "Aucun article",
        description: `Aucun article à imprimer pour le dépôt ${depotName}.`,
        variant: "destructive",
      });
      return;
    }
    
    // Create print window
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      toast({
        title: "Erreur d'impression",
        description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez vos paramètres de navigateur.",
        variant: "destructive",
      });
      return;
    }
    
    // Format the current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR');
    
    // Calculate total
    const totalValue = depotItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Generate HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Bon d'Entrée - ${depotName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h2 { margin: 5px 0; }
            .info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .info-block { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; }
            .signature { width: 45%; }
            .total { text-align: right; font-weight: bold; margin: 10px 0; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>BON D'ENTRÉE DE DÉPÔT</h2>
            <p>Dépôt: ${depotName}</p>
          </div>
          
          <div class="info">
            <div class="info-block">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Référence:</strong> ${formData.reference}</p>
            </div>
            <div class="info-block">
              <p><strong>Fournisseur:</strong> ${formData.supplierName}</p>
              <p><strong>Date de facture:</strong> ${formData.purchaseDate}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              ${depotItems.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitPrice.toLocaleString()} FCFA</td>
                  <td>${(item.quantity * item.unitPrice).toLocaleString()} FCFA</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p>Total: ${totalValue.toLocaleString()} FCFA</p>
          </div>
          
          <div class="footer">
            <div class="signature">
              <p>Réceptionné par:</p>
              <p>________________________</p>
              <p>Nom et signature</p>
            </div>
            <div class="signature">
              <p>Approuvé par:</p>
              <p>________________________</p>
              <p>Nom et signature</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Imprimer</button>
          </div>
          
          <script>
            // Auto print
            window.onload = function() {
              // Uncomment to auto-print
              // window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    toast({
      title: "Bon d'entrée généré",
      description: `Le bon d'entrée pour le dépôt ${depotName} a été généré.`,
    });
  };

  // Load initial data if editing
  useEffect(() => {
    if (initialPurchase) {
      setFormData({
        ...initialPurchase
      });
      
      // Load purchase items if they exist
      if (initialPurchase.items && initialPurchase.items.length > 0) {
        setPurchaseItems(initialPurchase.items);
      } else {
        // We'll need to reconstruct purchaseItems from initialPurchase
        // In a real app with a proper data model, this would be different
        setPurchaseItems([{
          productId: '0',
          productName: initialPurchase.productName,
          quantity: initialPurchase.quantity,
          unitPrice: initialPurchase.unitPrice,
          sellPrice: 0,
          depot: 'Principal' // Default depot for existing items
        }]);
      }

      // Set payment methods if they exist
      if (initialPurchase.paymentMethods && initialPurchase.paymentMethods.length > 0) {
        setPaymentMethods(initialPurchase.paymentMethods);
      }
    }
  }, [initialPurchase]);

  // Update supplier info when supplier is selected
  useEffect(() => {
    if (selectedSupplier) {
      setFormData(prev => ({
        ...prev,
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.name
      }));
    }
  }, [selectedSupplier]);

  // Calculate totals and validate form
  const calculateTotals = () => {
    const totalAmount = purchaseItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalPaid = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    const balance = totalAmount - totalPaid;
    
    setFormData(prev => ({
      ...prev,
      totalAmount,
      totalPaid,
      balance,
      status: balance <= 0 ? 'payée' : 'impayée'
    }));
  };

  // Validate form on data changes
  useEffect(() => {
    calculateTotals();
    
    const isFormValid = 
      formData.reference?.trim() !== '' && 
      formData.purchaseDate?.trim() !== '' &&
      selectedSupplier !== null &&
      purchaseItems.length > 0 &&
      purchaseItems.every(item => 
        item.quantity > 0 && 
        item.unitPrice > 0 && 
        item.depot
      );
    
    setIsValid(isFormValid);
  }, [formData, selectedSupplier, purchaseItems, paymentMethods]);

  // Purchase items management - improved to handle state updates better
  const addPurchaseItem = () => {
    console.log("Adding new purchase item");
    
    const newItem = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      sellPrice: 0,
      depot: 'Principal'
    };
    
    setPurchaseItems(items => [...items, newItem]);
    console.log("New item should be added now");
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(items => items.filter((_, i) => i !== index));
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    console.log(`Updating item ${index}, field: ${field}, value:`, value);
    
    setPurchaseItems(items => {
      // Make sure the index is valid
      if (index >= items.length) {
        console.warn(`Invalid index: ${index}, items length: ${items.length}`);
        return items;
      }
      
      // Create a new array with the updated item
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      console.log(`Item ${index} updated, new value:`, newItems[index]);
      return newItems;
    });
  };

  // Payment methods management
  const addPaymentMethod = () => {
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      method: 'cash',
      amount: 0
    };
    
    setPaymentMethods(prev => [...prev, newPayment]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const updatePaymentMethod = (id: string, field: keyof PaymentMethod, value: any) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, [field]: value } : method
      )
    );
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast({
        title: "Formulaire invalide",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // For backward compatibility, use the first item's details
    const firstItem = purchaseItems[0];
    
    const newPurchase: Purchase = {
      id: initialPurchase?.id || `ACH${Date.now().toString().substring(8)}`,
      reference: formData.reference,
      purchaseDate: formData.purchaseDate,
      supplierId: formData.supplierId,
      supplierName: formData.supplierName,
      productName: firstItem.productName,
      quantity: firstItem.quantity,
      unitPrice: firstItem.unitPrice,
      totalAmount: formData.totalAmount,
      totalPaid: formData.totalPaid,
      balance: formData.balance,
      status: formData.status,
      paymentMethods: paymentMethods,
      items: purchaseItems
    };
    
    // Update inventory
    const inventoryUpdated = updateInventory(purchaseItems);
    
    if (!inventoryUpdated) {
      toast({
        title: "Erreur de mise à jour",
        description: "Impossible de mettre à jour l'inventaire. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }
    
    // Save purchase
    onSave(newPurchase);
    
    toast({
      title: initialPurchase ? "Achat mis à jour" : "Nouvel achat créé",
      description: `L'achat a été ${initialPurchase ? 'mis à jour' : 'créé'} avec succès et le stock a été mis à jour.`
    });
    
    onClose();
  };

  return {
    formData,
    selectedSupplier,
    purchaseItems,
    paymentMethods,
    isValid,
    setFormData,
    setSelectedSupplier,
    addPurchaseItem,
    removePurchaseItem,
    updatePurchaseItem,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod,
    calculateTotals,
    handleSubmit,
    printDepotEntry
  };
};
