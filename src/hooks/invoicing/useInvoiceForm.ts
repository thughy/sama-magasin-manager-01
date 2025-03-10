
import { useState, useEffect } from "react";
import { Invoice, InvoiceItem } from "@/services/api/invoicing";
import { format } from "date-fns";
import { usePaymentMethods } from "@/hooks/purchase-form/usePaymentMethods";
import { Client } from "@/data/clientsData";
import { Item } from "@/types/product";

export const useInvoiceForm = (invoice: Invoice | null, onSave: (invoice: Partial<Invoice> & { id?: string }) => void) => {
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
    const calculatedTotal = items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.totalPrice.toString());
      return sum + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
    setTotalAmount(calculatedTotal);
    
    // Calculate total from payment methods
    const totalPaid = paymentMethods.reduce((sum, payment) => {
      const paymentAmount = parseFloat(payment.amount.toString());
      return sum + (isNaN(paymentAmount) ? 0 : paymentAmount);
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
    quantity = parseFloat(quantity.toString());
    unitPrice = parseFloat(unitPrice.toString());
    discount = parseFloat(discount.toString());
    
    // Apply calculations
    const discountAmount = (unitPrice * discount) / 100;
    const discountedPrice = unitPrice - discountAmount;
    return quantity * discountedPrice;
  };

  const handleAddItem = (item: any) => {
    // Vérifie si l'item reçu est déjà au format InvoiceItem
    if (item.productId && item.productName) {
      // Ensure numeric properties are numbers
      if (typeof item.quantity !== 'number') {
        item.quantity = parseFloat(item.quantity);
      }
      if (typeof item.unitPrice !== 'number') {
        item.unitPrice = parseFloat(item.unitPrice);
      }
      if (typeof item.discount !== 'number') {
        item.discount = parseFloat(item.discount || 0);
      }
      if (typeof item.totalPrice !== 'number') {
        item.totalPrice = parseFloat(item.totalPrice);
      }
      
      setItems([...items, item]);
      return;
    }
    
    // Sinon, convertir en InvoiceItem
    const unitPrice = item.type === 'product' ? 
      parseFloat(item.sellPrice.toString()) : 
      parseFloat(item.amount.toString());
    
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productId: item.id,
      productName: item.name,
      quantity: 1,
      unitPrice: unitPrice,
      discount: 0, // Initialize discount to 0
      totalPrice: unitPrice, // No discount initially
      type: item.type
    };
    
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // First create a new item with the updated field
        const updatedItem = { ...item };
        
        // Ensure numeric values are always stored as numbers
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'totalPrice') {
          updatedItem[field] = parseFloat(value.toString());
        } else {
          updatedItem[field] = value;
        }
        
        // Recalculate totalPrice if quantity, unitPrice, or discount changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          updatedItem.totalPrice = calculateItemTotal(
            updatedItem.quantity, 
            updatedItem.unitPrice, 
            updatedItem.discount || 0
          );
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
