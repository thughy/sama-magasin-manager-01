
import { useState, useEffect } from "react";
import { Invoice, InvoiceItem } from "@/services/api/invoicing";
import { format } from "date-fns";
import { usePaymentMethods } from "@/hooks/purchase-form/usePaymentMethods";
import { Client } from "@/data/clientsData";
import { Item } from "@/types/product";

// Helper function to ensure a value is a number
const ensureNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Default counter client when no client is selected
export const DEFAULT_CLIENT = {
  id: "CLIENT-COMPTOIR",
  name: "CLIENT COMPTOIR",
  phone: "",
  email: "",
  type: "Occasionnel",
  balance: 0,
  lastPurchase: format(new Date(), "dd/MM/yyyy")
};

export const useInvoiceForm = (invoice: Invoice | null, onSave: (invoice: Partial<Invoice> & { id?: string }) => void) => {
  const [reference, setReference] = useState(invoice?.reference || `FAC-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(invoice?.date || format(new Date(), "yyyy-MM-dd"));
  const [clientId, setClientId] = useState(invoice?.clientId || DEFAULT_CLIENT.id);
  const [clientName, setClientName] = useState(invoice?.clientName || DEFAULT_CLIENT.name);
  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [totalAmount, setTotalAmount] = useState(ensureNumber(invoice?.totalAmount));
  const [amountPaid, setAmountPaid] = useState(ensureNumber(invoice?.amountPaid));
  const [balance, setBalance] = useState(ensureNumber(invoice?.balance));

  const { 
    paymentMethods, 
    setPaymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    updatePaymentMethod 
  } = usePaymentMethods(invoice?.paymentMethods || []);

  useEffect(() => {
    // Calculate total amount from items
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + ensureNumber(item.totalPrice);
    }, 0);
    setTotalAmount(calculatedTotal);
    
    // Calculate total from payment methods
    const totalPaid = paymentMethods.reduce((sum, payment) => {
      return sum + ensureNumber(payment.amount);
    }, 0);
    setAmountPaid(totalPaid);
    
    // Calculate balance
    setBalance(calculatedTotal - totalPaid);
  }, [items, paymentMethods]);

  const handleClientSelect = (client: Client) => {
    if (!client.id || client.id.trim() === "") {
      // If no client is selected or client has no ID, use the default counter client
      setClientId(DEFAULT_CLIENT.id);
      setClientName(DEFAULT_CLIENT.name);
    } else {
      setClientId(client.id);
      setClientName(client.name);
    }
  };

  const calculateItemTotal = (quantity: number, unitPrice: number, discount: number = 0) => {
    // Ensure all inputs are numbers
    quantity = ensureNumber(quantity);
    unitPrice = ensureNumber(unitPrice);
    discount = ensureNumber(discount);
    
    // Calculate the total price with discount
    const discountMultiplier = (100 - discount) / 100;
    return quantity * unitPrice * discountMultiplier;
  };

  const handleAddItem = (item: any) => {
    // Make a deep copy to avoid mutation
    const newItem: InvoiceItem = {
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: ensureNumber(item.quantity),
      unitPrice: ensureNumber(item.unitPrice),
      discount: ensureNumber(item.discount || 0),
      totalPrice: ensureNumber(item.totalPrice),
      type: item.type
    };
    
    console.log("Adding new item to invoice:", newItem);
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          // Create a copy of the item
          const updatedItem = { ...item };
          
          // Handle numeric fields specially
          if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'totalPrice') {
            updatedItem[field] = ensureNumber(value);
          } else {
            updatedItem[field] = value;
          }
          
          // If we're not directly updating the totalPrice, recalculate it
          if (field !== 'totalPrice' && (field === 'quantity' || field === 'unitPrice' || field === 'discount')) {
            updatedItem.totalPrice = calculateItemTotal(
              updatedItem.quantity, 
              updatedItem.unitPrice, 
              updatedItem.discount
            );
          }
          
          console.log("Updated item:", { 
            id, 
            field, 
            oldValue: item[field], 
            newValue: updatedItem[field],
            updatedItem 
          });
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    // Ensure client info is set, defaulting to counter client if empty
    const finalClientId = clientId || DEFAULT_CLIENT.id;
    const finalClientName = clientName || DEFAULT_CLIENT.name;
    
    const invoiceData: Partial<Invoice> & { id?: string } = {
      id: invoice?.id,
      reference,
      date,
      clientId: finalClientId,
      clientName: finalClientName,
      items,
      totalAmount,
      amountPaid,
      balance,
      status: amountPaid === 0 ? 'unpaid' : amountPaid < totalAmount ? 'partial' : 'paid',
      depot: "Principal",
      paymentMethods,
    };
    
    onSave(invoiceData);
  };

  return {
    reference,
    setReference,
    date,
    setDate,
    clientId,
    clientName,
    items,
    totalAmount,
    amountPaid,
    balance,
    paymentMethods,
    handleClientSelect,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    handleSubmit,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod
  };
};
