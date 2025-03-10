
/**
 * API Service pour communiquer avec le backend
 * 
 * Note: Ce service utilise actuellement le localStorage comme solution temporaire
 * Pour l'utiliser avec MySQL, vous devez:
 * 1. Créer un serveur backend (Node.js, PHP, etc.) qui se connecte à MySQL
 * 2. Exposer des API REST pour manipuler les données
 * 3. Remplacer la variable MODE ci-dessous par 'api'
 */

// Mode de fonctionnement: 'localStorage' (temporaire) ou 'api' (avec backend)
const MODE: 'localStorage' | 'api' = 'localStorage';

// URL de base de l'API - à remplacer par l'URL réelle de votre serveur backend
const API_BASE_URL = 'http://localhost:3000/api';

// Clés pour le stockage local
const STORAGE_KEYS = {
  PROFORMAS: 'app_proformas',
  CLIENTS: 'app_clients',
};

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
  if (MODE === 'localStorage') {
    // Implémentation avec localStorage
    return handleLocalStorage<T>(endpoint, method, body);
  }
  
  // Implémentation avec API réelle
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

// Gestion du stockage local (solution temporaire)
async function handleLocalStorage<T>(
  endpoint: string,
  method: string,
  body?: any
): Promise<ApiResponse<T>> {
  // Extraction du type d'entité et de l'ID éventuel à partir de l'endpoint
  const [, entityType, entityId] = endpoint.split('/');
  const storageKey = entityType === 'proformas' 
    ? STORAGE_KEYS.PROFORMAS 
    : STORAGE_KEYS.CLIENTS;
  
  try {
    // Récupération des données actuelles du stockage
    const storedData = localStorage.getItem(storageKey);
    let data = storedData ? JSON.parse(storedData) : [];
    
    switch (method) {
      case 'GET':
        if (entityId) {
          const item = data.find((item: any) => item.id === entityId);
          return { success: true, data: item as T };
        }
        return { success: true, data: data as T };
        
      case 'POST':
        // Générer un ID si non fourni
        if (!body.id) {
          body.id = `${entityType}-${Date.now()}`;
        }
        data.push(body);
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { success: true, data: body as T };
        
      case 'PUT':
        if (!entityId) return { success: false, error: 'ID manquant' };
        data = data.map((item: any) => 
          item.id === entityId ? { ...item, ...body } : item
        );
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { success: true, data: body as T };
        
      case 'DELETE':
        if (!entityId) return { success: false, error: 'ID manquant' };
        data = data.filter((item: any) => item.id !== entityId);
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { success: true };
        
      default:
        return { success: false, error: 'Méthode non supportée' };
    }
  } catch (error) {
    console.error('LocalStorage operation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur lors du traitement local' 
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
