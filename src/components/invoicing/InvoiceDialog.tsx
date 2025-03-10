
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Invoice, InvoiceItem, clientApi } from "@/services/api";
import { format } from "date-fns";
import { ClientSearchInput } from "@/components/proforma/client-search/ClientSearchInput";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { usePaymentMethods } from "@/hooks/purchase-form/usePaymentMethods";
import { PaymentMethodsSection } from "@/components/suppliers/purchases/PaymentMethodsSection";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSave: (invoice: Partial<Invoice> & { id?: string }) => void;
}

export const InvoiceDialog = ({ open, onOpenChange, invoice, onSave }: InvoiceDialogProps) => {
  const [reference, setReference] = useState(invoice?.reference || `FAC-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(invoice?.date || format(new Date(), "yyyy-MM-dd"));
  const [clientId, setClientId] = useState(invoice?.clientId || "");
  const [clientName, setClientName] = useState(invoice?.clientName || "");
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [totalAmount, setTotalAmount] = useState(invoice?.totalAmount || 0);
  const [amountPaid, setAmountPaid] = useState(invoice?.amountPaid || 0);
  const [balance, setBalance] = useState(invoice?.balance || 0);

  const { 
    paymentMethods, 
    setPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    updatePaymentMethod 
  } = usePaymentMethods(invoice?.paymentMethods || []);

  useEffect(() => {
    // Calculate total amount from items
    const calculatedTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(calculatedTotal);
    
    // Calculate total from payment methods
    const totalPaid = paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
    setAmountPaid(totalPaid);
    
    // Calculate balance
    setBalance(calculatedTotal - totalPaid);
  }, [items, paymentMethods]);

  const handleClientSelect = (client: any) => {
    setClientId(client.id);
    setClientName(client.name);
  };

  const handleAddItem = (item: any) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productId: item.id,
      productName: item.name,
      quantity: 1,
      unitPrice: item.sellPrice || 0,
      totalPrice: item.sellPrice || 0,
    };
    
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate totalPrice if quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    const invoiceData: Partial<Invoice> & { id?: string } = {
      id: invoice?.id,
      reference,
      date,
      clientId,
      clientName,
      items,
      totalAmount,
      amountPaid,
      balance,
      status: amountPaid === 0 ? 'unpaid' : amountPaid < totalAmount ? 'partial' : 'paid',
      depot: "Principal", // Setting the main depot as requested
      paymentMethods,
    };
    
    onSave(invoiceData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{invoice ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <ClientSearchInput 
              onClientSelect={handleClientSelect}
              initialValue={clientName}
            />
          </div>

          <div className="space-y-4 mt-4">
            <InvoiceItemsTable 
              items={items}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onAddPaymentMethod={addPaymentMethod}
            onRemovePaymentMethod={removePaymentMethod}
            onUpdatePaymentMethod={updatePaymentMethod}
          />

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Montant total</Label>
              <div className="bg-gray-100 p-2 rounded text-right font-semibold">
                {totalAmount.toLocaleString()} FCFA
              </div>
            </div>
            <div>
              <Label>Montant payé</Label>
              <div className="bg-gray-100 p-2 rounded text-right font-semibold">
                {amountPaid.toLocaleString()} FCFA
              </div>
            </div>
            <div>
              <Label>Solde</Label>
              <div className={`p-2 rounded text-right font-semibold ${balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {balance.toLocaleString()} FCFA
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={!clientId || items.length === 0}
          >
            {invoice ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
