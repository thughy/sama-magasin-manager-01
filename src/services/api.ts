
/**
 * API Service pour communiquer avec le backend
 * 
 * Note: Ce service est un modèle. Pour l'utiliser réellement, vous devez:
 * 1. Créer un serveur backend (Node.js, PHP, etc.) qui se connecte à MySQL
 * 2. Exposer des API REST pour manipuler les données
 * 3. Remplacer les URLs ci-dessous par celles de votre serveur
 */

// URL de base de l'API - à remplacer par l'URL réelle de votre serveur backend
const API_BASE_URL = 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Fonction générique pour effectuer des requêtes HTTP
async function fetchApi<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || `Erreur ${response.status}: ${response.statusText}` 
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Une erreur est survenue' 
    };
  }
}

// Fonctions spécifiques pour les proformas
export const proformaApi = {
  getAll: () => fetchApi<any[]>('/proformas'),
  getById: (id: string) => fetchApi<any>(`/proformas/${id}`),
  create: (proforma: any) => fetchApi<any>('/proformas', 'POST', proforma),
  update: (id: string, proforma: any) => fetchApi<any>(`/proformas/${id}`, 'PUT', proforma),
  delete: (id: string) => fetchApi<void>(`/proformas/${id}`, 'DELETE'),
};

// Vous pouvez ajouter d'autres sections pour d'autres entités (clients, produits, etc.)
export const clientApi = {
  getAll: () => fetchApi<any[]>('/clients'),
  getById: (id: string) => fetchApi<any>(`/clients/${id}`),
  create: (client: any) => fetchApi<any>('/clients', 'POST', client),
  update: (id: string, client: any) => fetchApi<any>(`/clients/${id}`, 'PUT', client),
  delete: (id: string) => fetchApi<void>(`/clients/${id}`, 'DELETE'),
};
