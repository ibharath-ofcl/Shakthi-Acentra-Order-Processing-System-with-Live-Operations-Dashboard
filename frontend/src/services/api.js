/**
 * Shakthi-Acentra API Service Layer
 * Direct integration with backend endpoints.
 */

const API_BASE = '/api/v1';

// Helper for unique idempotency key generation
export function generateIdempotencyKey(prefix = 'KEY') {
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}-${ts}-${random}`;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API error on ${url}:`, error);
    throw error;
  }
}

export const healthApi = {
  getSystemHealth: () => request('/health'),
};

export const operationsApi = {
  getStatistics: () => request('/operations/statistics'),
  getRecentEvents: (limit = 50) => request(`/operations/events?limit=${limit}`),
  getDlqMessages: (page = 0, size = 50) => request(`/operations/dlq?page=${page}&size=${size}`),
  retryDlqMessage: (id) => request(`/operations/dlq/${id}/retry`, { method: 'POST' }),
  discardDlqMessage: (id) => request(`/operations/dlq/${id}/discard`, { method: 'POST' }),
};

export const ordersApi = {
  getAllOrders: (page = 0, size = 20) => request(`/orders?page=${page}&size=${size}`),
  getOrderByNumber: (orderNumber) => request(`/orders/${orderNumber}`),
  createOrder: (orderData, idempotencyKey = null) => {
    const key = idempotencyKey || generateIdempotencyKey('ORD-INTAKE');
    return request('/orders', {
      method: 'POST',
      headers: {
        'Idempotency-Key': key,
      },
      body: JSON.stringify(orderData),
    });
  },
};

export const inventoryApi = {
  getAllInventory: () => request('/inventory'),
  getInventoryBySku: (sku) => request(`/inventory/${sku}`),
  restock: (sku, quantity) => request('/inventory/restock', {
    method: 'POST',
    body: JSON.stringify({ sku, quantity }),
  }),
};
