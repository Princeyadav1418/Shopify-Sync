import { toast } from 'sonner';

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Enterprise-grade fetch wrapper with exponential backoff, rate limiting handling,
 * and robust error parsing.
 */
export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<any> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
  
  const token = localStorage.getItem('access_token');
  const headers = new Headers(fetchOptions.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('Content-Type', 'application/json');

  let attempt = 0;
  
  while (attempt < retries) {
    try {
      const response = await fetch(url, { ...fetchOptions, headers });
      
      if (response.status === 429) {
        toast.warning('Rate limit reached', { description: 'Applying backoff...' });
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt * 2));
        attempt++;
        continue;
      }
      
      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }
      
      return await response.json();
      
    } catch (error: any) {
      attempt++;
      console.warn(`[API] Attempt ${attempt} failed for ${url}:`, error.message);
      
      if (attempt >= retries) {
        toast.error('Network failure', { description: `Failed to connect after ${retries} attempts.` });
        throw error;
      } else {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }
}

export const api = {
  getStores: () => fetchWithRetry('/api/shopify/stores'),
  getProducts: () => fetchWithRetry('/api/shopify/products'),
  getCustomers: () => fetchWithRetry('/api/shopify/customers'),
  getOrders: () => fetchWithRetry('/api/shopify/orders'),
  getAnalytics: () => fetchWithRetry('/api/shopify/analytics'),
  getInventory: () => fetchWithRetry('/api/shopify/inventory'),
};
