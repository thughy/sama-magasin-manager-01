
import { useState } from 'react';
import { PaymentMethod } from '@/types/purchase';
import { format } from 'date-fns';

export const usePaymentMethods = (initialMethods: PaymentMethod[] = []) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialMethods);

  const addPaymentMethod = () => {
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      method: 'cash',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd') // Add the current date as default
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

  return {
    paymentMethods,
    setPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    updatePaymentMethod
  };
};
