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

export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<any> {
    const res = await fetch(url, options);
    return res.json();
}

export const api = {
  getStores: async () => {
    return fetchWithRetry('/api/shopify/stores');
  },
  getOrders: async () => {
    return fetchWithRetry('/api/shopify/orders');
  },
  getProducts: async () => {
    return fetchWithRetry('/api/shopify/products');
  },
  getCustomers: async () => {
    return fetchWithRetry('/api/shopify/customers');
  },
  getInventory: async () => {
    return fetchWithRetry('/api/shopify/inventory');
  },
  getAnalytics: async () => {
    return fetchWithRetry('/api/shopify/analytics');
  }
};
