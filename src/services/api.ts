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

// Sample proforma items for demo purposes
const SAMPLE_ITEMS = [
  {
    id: 'item-1',
    name: 'Produit 1',
    type: 'product',
    quantity: 2,
    unitPrice: 5000
  },
  {
    id: 'item-2',
    name: 'Service 1',
    type: 'service',
    quantity: 1,
    unitPrice: 15000
  }
];

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Create a deep clone helper to avoid reference issues
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Fonction générique pour effectuer des requêtes HTTP
async function fetchApi<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  if (MODE === 'localStorage') {
    console.log(`[API] ${method} ${endpoint}`, body);
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
          console.log(`[LocalStorage] GET ${entityType}/${entityId}`);
          const item = data.find((item: any) => item.id === entityId);
          
          if (!item) {
            console.log(`[LocalStorage] ${entityType} with id ${entityId} not found`);
            return { success: false, error: `${entityType} non trouvé` };
          }
          
          // For proformas, ensure necessary data exists
          if (entityType === 'proformas' && item) {
            // Create a deep copy to ensure we don't modify the original data
            const itemCopy = deepClone(item);
            
            // Add client details if not present
            if (!itemCopy.clientEmail) {
              itemCopy.clientEmail = 'client@example.com';
            }
            if (!itemCopy.clientPhone) {
              itemCopy.clientPhone = '77 123 45 67';
            }
            
            // Add items if not present
            if (!itemCopy.items || !Array.isArray(itemCopy.items) || itemCopy.items.length === 0) {
              itemCopy.items = deepClone(SAMPLE_ITEMS);
            }
            
            console.log("Returning proforma with items:", itemCopy);
            return { success: true, data: itemCopy as T };
          }
          
          return { success: true, data: deepClone(item) as T };
        }
        return { success: true, data: deepClone(data) as T };
        
      case 'POST':
        // Générer un ID si non fourni
        if (!body.id) {
          body.id = `${entityType}-${Date.now()}`;
        }
        
        // For proformas, save items in the body
        if (entityType === 'proformas' && body.items) {
          console.log(`[LocalStorage] Creating proforma with ${body.items.length} items`);
        }
        
        data.push(deepClone(body));
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { success: true, data: deepClone(body) as T };
        
      case 'PUT':
        if (!entityId) return { success: false, error: 'ID manquant' };
        
        // For proformas, ensure items are saved too
        if (entityType === 'proformas' && body.items) {
          console.log(`[LocalStorage] Updating proforma with ${body.items.length} items`);
        }
        
        data = data.map((item: any) => 
          item.id === entityId ? { ...deepClone(item), ...deepClone(body) } : item
        );
        localStorage.setItem(storageKey, JSON.stringify(data));
        return { success: true, data: deepClone(body) as T };
        
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
  update: (proforma: any) => fetchApi<any>(`/proformas/${proforma.id}`, 'PUT', proforma),
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
