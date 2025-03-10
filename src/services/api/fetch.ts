
/**
 * API fetch utility for making HTTP requests
 */

import { ApiResponse, API_BASE_URL, MODE } from './core';
import { handleLocalStorage } from './localStorage';

// Fonction générique pour effectuer des requêtes HTTP
export async function fetchApi<T>(
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
