
/**
 * API client for invoice operations
 */

import { fetchApi } from './fetch';
import { ApiResponse } from './core';

// API client for invoices
export const invoicingApi = {
  getAll: () => fetchApi<any[]>('/invoices'),
  getById: (id: string) => fetchApi<any>(`/invoices/${id}`),
  create: (invoice: any) => fetchApi<any>('/invoices', 'POST', invoice),
  update: (id: string, invoice: any) => fetchApi<any>(`/invoices/${id}`, 'PUT', invoice),
  delete: (id: string) => fetchApi<void>(`/invoices/${id}`, 'DELETE'),
  // Méthodes spécifiques aux factures
  markAsPaid: (id: string) => fetchApi<any>(`/invoices/${id}/pay`, 'PUT'),
  generatePdf: (id: string) => fetchApi<{url: string}>(`/invoices/${id}/pdf`, 'GET'),
};
