
import { useToast } from '@/hooks/use-toast';
import { PurchaseItem } from '@/types/purchase';

export const useDepotEntryPrinting = (
  formData: { 
    reference: string; 
    purchaseDate: string; 
    supplierName: string; 
  },
  purchaseItems: PurchaseItem[]
) => {
  const { toast } = useToast();
  
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

  return { printDepotEntry };
};
