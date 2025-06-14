// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sd-6310-2025-summer-express-app.onrender.com/api';

export interface Person {
  id: number;
  name: string;
  relationship?: string;
  birthday?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  event_date: string;
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
  price_range?: string;
  url?: string;
  description?: string;
  person_name?: string;
  event_name?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

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
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If we can't parse the error response as JSON, use the default error message
          console.warn('Could not parse error response as JSON:', e);
        }
        
        console.error(`API request failed: ${url}`, {
          status: response.status,
          statusText: response.statusText,
          errorMessage
        });
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`Response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

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
    const response = await this.get<{message: string, person: Person}>(`/people/${id}`);
    return response.person; // Extract the person from the wrapper
  }

  async createPerson(person: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Promise<Person> {
    return this.post<Person>('/people', person);
  }

  async updatePerson(id: number, person: Partial<Person>): Promise<Person> {
    try {
      const response = await this.patch<{message: string, person: Person}>(`/people/${id}`, person);
      return response.person; // Extract the person from the wrapper
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
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
    try {
      const response = await this.get<{message: string, gift_ideas: GiftIdea[]}>('/gift-ideas');
      return response.gift_ideas || [];
    } catch (error) {
      console.error('Failed to fetch gift ideas:', error);
      return []; 
    }
  }

  async getGiftIdea(id: number): Promise<GiftIdea> {
    const response = await this.get<{message: string, gift_idea: GiftIdea}>(`/gift-ideas/${id}`);
    return response.gift_idea;
  }

  async createGiftIdea(giftIdea: Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>): Promise<GiftIdea> {
    const response = await this.post<{message: string, gift_idea: GiftIdea}>('/gift-ideas', giftIdea);
    return response.gift_idea;
  }

  async updateGiftIdea(id: number, giftIdea: Partial<GiftIdea>): Promise<GiftIdea> {
    const response = await this.put<{message: string, gift_idea: GiftIdea}>(`/gift-ideas/${id}`, giftIdea);
    return response.gift_idea;
  }

  async patchGiftIdea(id: number, giftIdea: Partial<GiftIdea>): Promise<GiftIdea> {
    const response = await this.patch<{message: string, gift_idea: GiftIdea}>(`/gift-ideas/${id}`, giftIdea);
    return response.gift_idea;
  }

  async deleteGiftIdea(id: number): Promise<void> {
    await this.delete(`/gift-ideas/${id}`);
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

export const api = new ApiClient(API_BASE_URL);

export default ApiClient;