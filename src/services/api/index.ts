/**
 * API Service - Main export file
 * 
 * Note: Ce service utilise actuellement le localStorage comme solution temporaire
 * Pour l'utiliser avec MySQL, vous devez:
 * 1. Créer un serveur backend (Node.js, PHP, etc.) qui se connecte à MySQL
 * 2. Exposer des API REST pour manipuler les données
 * 3. Remplacer la variable MODE dans core.ts par 'api'
 */

// Export api clients
export { proformaApi } from './proforma';
export { clientApi } from './client';
export { invoicingApi } from './invoicing';

// Export types from invoicing
export type { Invoice, InvoiceItem } from './invoicing';

// Export types and utilities
export type { ApiResponse } from './core';
export { deepClone } from './core';

// Export from invoicing module
export * from './invoicing';
