const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Attempt to read cached token for header fallback
    try {
      this.token = localStorage.getItem('vibespace_auth_token');
    } catch {
      this.token = null;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem('vibespace_auth_token', token);
      } else {
        localStorage.removeItem('vibespace_auth_token');
      }
    } catch {
      // ignore localStorage errors
    }
  }

  getToken(): string | null {
    return this.token;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Sends HttpOnly cookie automatically
    });

    if (!res.ok) {
      let errorData: any = {};
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: res.statusText };
      }
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
