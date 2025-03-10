
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

export const useInvoiceForm = (invoice: Invoice | null, onSave: (invoice: Partial<Invoice> & { id?: string }) => void) => {
  const [reference, setReference] = useState(invoice?.reference || `FAC-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(invoice?.date || format(new Date(), "yyyy-MM-dd"));
  const [clientId, setClientId] = useState(invoice?.clientId || "");
  const [clientName, setClientName] = useState(invoice?.clientName || "");
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
    setClientId(client.id);
    setClientName(client.name);
  };

  const calculateItemTotal = (quantity: number, unitPrice: number, discount: number = 0) => {
    // Ensure all inputs are numbers
    quantity = ensureNumber(quantity);
    unitPrice = ensureNumber(unitPrice);
    discount = ensureNumber(discount);
    
    // Apply calculations
    const discountAmount = (unitPrice * discount) / 100;
    const discountedPrice = unitPrice - discountAmount;
    return quantity * discountedPrice;
  };

  const handleAddItem = (item: any) => {
    // Make a copy to avoid mutation
    const newItem = { ...item };
    
    // Ensure all numeric values are actually numbers
    if (typeof newItem.quantity !== 'number') {
      newItem.quantity = ensureNumber(newItem.quantity);
    }
    if (typeof newItem.unitPrice !== 'number') {
      newItem.unitPrice = ensureNumber(newItem.unitPrice);
    }
    if (typeof newItem.discount !== 'number') {
      newItem.discount = ensureNumber(newItem.discount || 0);
    }
    if (typeof newItem.totalPrice !== 'number') {
      newItem.totalPrice = ensureNumber(newItem.totalPrice);
    }
    
    console.log("Adding item to invoice:", newItem);
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // Create a copy of the item
        const updatedItem = { ...item };
        
        // Handle numeric fields specially
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'totalPrice') {
          updatedItem[field] = ensureNumber(value);
        } else {
          updatedItem[field] = value;
        }
        
        // Recalculate totalPrice if quantity, unitPrice, or discount changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
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
