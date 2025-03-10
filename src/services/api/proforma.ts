
/**
 * API client for proforma operations
 */

import { fetchApi } from './fetch';
import { ApiResponse } from './core';

// Fonctions spécifiques pour les proformas
export const proformaApi = {
  getAll: () => fetchApi<any[]>('/proformas'),
  getById: (id: string) => fetchApi<any>(`/proformas/${id}`),
  create: (proforma: any) => fetchApi<any>('/proformas', 'POST', proforma),
  update: (proforma: any) => fetchApi<any>(`/proformas/${proforma.id}`, 'PUT', proforma),
  delete: (id: string) => fetchApi<void>(`/proformas/${id}`, 'DELETE'),
};
