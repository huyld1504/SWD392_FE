const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response;
  },

  async get(endpoint: string) {
    return (await this.fetch(endpoint)).json();
  },

  async post(endpoint: string, data: any) {
    return (await this.fetch(endpoint, { method: 'POST', body: JSON.stringify(data) })).json();
  },

  async put(endpoint: string, data: any) {
    return (await this.fetch(endpoint, { method: 'PUT', body: JSON.stringify(data) })).json();
  },

  async delete(endpoint: string) {
    return (await this.fetch(endpoint, { method: 'DELETE' })).json();
  }
};
