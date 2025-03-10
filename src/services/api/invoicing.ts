
/**
 * API client for invoice operations
 */

import { fetchApi } from './fetch';
import { ApiResponse } from './core';

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  reference: string;
  date: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  depot: string;
  paymentMethods: {
    id: string;
    method: 'cash' | 'wave' | 'orangeMoney' | 'cheque' | 'bank';
    amount: number;
    date: string;
  }[];
}

// API client for invoices
export const invoicingApi = {
  getAll: () => fetchApi<Invoice[]>('/invoices'),
  getById: (id: string) => fetchApi<Invoice>(`/invoices/${id}`),
  create: (invoice: Omit<Invoice, 'id'>) => fetchApi<Invoice>('/invoices', 'POST', invoice),
  update: (id: string, invoice: Partial<Invoice>) => fetchApi<Invoice>(`/invoices/${id}`, 'PUT', invoice),
  delete: (id: string) => fetchApi<void>(`/invoices/${id}`, 'DELETE'),
  // Méthodes spécifiques aux factures
  markAsPaid: (id: string) => fetchApi<Invoice>(`/invoices/${id}/pay`, 'PUT'),
  recordPayment: (id: string, payment: { method: string, amount: number, date: string }) => 
    fetchApi<Invoice>(`/invoices/${id}/payment`, 'POST', payment),
  generatePdf: (id: string) => fetchApi<{url: string}>(`/invoices/${id}/pdf`, 'GET'),
};
