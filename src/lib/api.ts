// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Types for our API responses
export interface Person {
  id: number;
  name: string;
  email?: string;
  relationship?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  event_date: string;  // Changed from 'date' to match your database
  description?: string;
  event_type?: string;
  recurring?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GiftIdea {
  id: number;
  person_id: number;
  event_id?: number;
  idea: string;
  status: 'idea' | 'purchased' | 'given';
  price?: number;
  url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

// Generic API client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // People endpoints
  async getPeople(): Promise<Person[]> {
    const response = await this.get<{message: string, people: Person[]}>('/people');
    return response.people; // Extract the people array from the wrapper
  }

  async getPerson(id: number): Promise<Person> {
    return this.get<Person>(`/people/${id}`);
  }

  async createPerson(person: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Promise<Person> {
    return this.post<Person>('/people', person);
  }

  async updatePerson(id: number, person: Partial<Person>): Promise<Person> {
    const response = await this.patch<{message: string, person: Person}>(`/people/${id}`, person);
    return response.person; // Extract the person from the wrapper
  }

  async deletePerson(id: number): Promise<void> {
    return this.delete<void>(`/people/${id}`);
  }

  // Events endpoints
  async getEvents(): Promise<Event[]> {
    const response = await this.get<{message: string, events: Event[]}>('/events');
    return response.events;
  }

  async getEvent(id: number): Promise<Event> {
    const response = await this.get<{message: string, event: Event}>(`/events/${id}`);
    return response.event;
  }

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const response = await this.post<{message: string, event: Event}>('/events', event);
    return response.event;
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const response = await this.patch<{message: string, event: Event}>(`/events/${id}`, event);
    return response.event;
  }

  async deleteEvent(id: number): Promise<void> {
    await this.delete(`/events/${id}`);
  }

  // Gift Ideas endpoints
  async getGiftIdeas(): Promise<GiftIdea[]> {
    return this.get<GiftIdea[]>('/gift-ideas');
  }

  async getGiftIdea(id: number): Promise<GiftIdea> {
    return this.get<GiftIdea>(`/gift-ideas/${id}`);
  }

  async getGiftIdeasByPerson(personId: number): Promise<GiftIdea[]> {
    return this.get<GiftIdea[]>(`/people/${personId}/gift-ideas`);
  }

  async createGiftIdea(giftIdea: Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>): Promise<GiftIdea> {
    return this.post<GiftIdea>('/gift-ideas', giftIdea);
  }

  async updateGiftIdea(id: number, giftIdea: Partial<GiftIdea>): Promise<GiftIdea> {
    return this.put<GiftIdea>(`/gift-ideas/${id}`, giftIdea);
  }

  async deleteGiftIdea(id: number): Promise<void> {
    return this.delete<void>(`/gift-ideas/${id}`);
  }

  // Dashboard stats endpoint
  async getDashboardStats(): Promise<{
    totalPeople: number;
    totalEvents: number;
    totalGiftIdeas: number;
    purchasedGifts: number;
  }> {
    return this.get('/dashboard/stats');
  }
}

// Create and export the API client instance
export const api = new ApiClient(API_BASE_URL);

// Export the client class for testing
export default ApiClient;