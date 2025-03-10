
/**
 * API client for client operations
 */

import { fetchApi } from './fetch';
import { ApiResponse } from './core';

// API client for clients
export const clientApi = {
  getAll: () => fetchApi<any[]>('/clients'),
  getById: (id: string) => fetchApi<any>(`/clients/${id}`),
  create: (client: any) => fetchApi<any>('/clients', 'POST', client),
  update: (id: string, client: any) => fetchApi<any>(`/clients/${id}`, 'PUT', client),
  delete: (id: string) => fetchApi<void>(`/clients/${id}`, 'DELETE'),
};
