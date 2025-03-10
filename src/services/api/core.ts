
/**
 * Core API utilities for handling API requests
 */

// Mode de fonctionnement: 'localStorage' (temporaire) ou 'api' (avec backend)
export const MODE: 'localStorage' | 'api' = 'localStorage';

// URL de base de l'API - à remplacer par l'URL réelle de votre serveur backend
export const API_BASE_URL = 'http://localhost:3000/api';

// Clés pour le stockage local
export const STORAGE_KEYS = {
  PROFORMAS: 'app_proformas',
  CLIENTS: 'app_clients',
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Create a deep clone helper to avoid reference issues
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
