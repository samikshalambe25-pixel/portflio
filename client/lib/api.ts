// Centralized API Client

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portflio-orcin-tau.vercel.app/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('portfolio_token') || localStorage.getItem('token');
  }
  return null;
};

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Safe fetch wrapper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error);
    return { success: false, error: 'Network error or backend offline' };
  }
}

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.success && res.token) {
      localStorage.setItem('portfolio_token', res.token);
      localStorage.setItem('portfolio_user', JSON.stringify(res.user));
    }
    return res;
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
    }
    return { success: true };
  },
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('portfolio_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
  isAuthenticated: () => {
    return !!getToken();
  }
};

export const homeApi = {
  get: () => apiFetch('/home'),
  update: (data: any) =>
    apiFetch('/home', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
};

export const aboutApi = {
  get: () => apiFetch('/about'),
  update: (data: any) =>
    apiFetch('/about', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
};

export const statsApi = {
  get: () => apiFetch('/stats'),
  update: (data: any) =>
    apiFetch('/stats', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
};

export const skillsApi = {
  getAll: () => apiFetch('/skills'),
  getById: (id: string) => apiFetch(`/skills/${id}`),
  create: (data: any) =>
    apiFetch('/skills', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }),
  update: (id: string, data: any) =>
    apiFetch(`/skills/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }),
  delete: (id: string) =>
    apiFetch(`/skills/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
};

export const projectsApi = {
  getAll: (category?: string) =>
    apiFetch(`/projects${category && category !== 'all' ? `?category=${category}` : ''}`),
  getById: (id: string) => apiFetch(`/projects/${id}`),
  create: (data: any) =>
    apiFetch('/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }),
  update: (id: string, data: any) =>
    apiFetch(`/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }),
  delete: (id: string) =>
    apiFetch(`/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
};

export const experiencesApi = {
  getAll: () => apiFetch('/experiences'),
  getById: (id: string) => apiFetch(`/experiences/${id}`),
  create: (data: any) =>
    apiFetch('/experiences', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }),
  update: (id: string, data: any) =>
    apiFetch(`/experiences/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }),
  delete: (id: string) =>
    apiFetch(`/experiences/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
};

export const contactApi = {
  submit: (data: { name: string; email: string; subject?: string; message: string }) =>
    apiFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getAll: () =>
    apiFetch('/contact', {
      headers: authHeaders()
    }),
  updateStatus: (id: string, status: string) =>
    apiFetch(`/contact/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    }),
  delete: (id: string) =>
    apiFetch(`/contact/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
};

export const footerApi = {
  get: () => apiFetch('/footer'),
  update: (data: any) =>
    apiFetch('/footer', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
};

export const resetApi = {
  resetAll: () =>
    apiFetch('/reset', {
      method: 'POST',
      headers: authHeaders()
    })
};
