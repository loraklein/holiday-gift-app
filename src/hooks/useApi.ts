import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Person, Event, GiftIdea } from '@/lib/api';

// Add this at the top of the file
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Query keys for consistent caching
export const queryKeys = {
  people: ['people'] as const,
  person: (id: number) => ['people', id] as const,
  events: ['events'] as const,
  event: (id: number) => ['events', id] as const,
  giftIdeas: ['gift-ideas'] as const,
  giftIdea: (id: number) => ['gift-ideas', id] as const,
  giftIdeasByPerson: (personId: number) => ['people', personId, 'gift-ideas'] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
};

// People hooks
export function usePeople() {
  return useQuery({
    queryKey: queryKeys.people,
    queryFn: async () => {
      await delay(2000); // 2 second delay
      return api.getPeople();
    },
  });
}

export function usePerson(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.person(id),
    queryFn: async () => {
      await delay(2000); // 2 second delay
      return api.getPerson(id);
    },
    enabled: options?.enabled !== false && !!id,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (person: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
      await delay(2000); // 2 second delay
      return api.createPerson(person);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...person }: { id: number } & Partial<Person>) => {
      await delay(2000); // 2 second delay
      return api.updatePerson(id, person);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.person(variables.id) });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await delay(2000); // 2 second delay
      return api.deletePerson(id);
    },
    onSuccess: (_, id) => {
      // Remove the person from the cache immediately
      queryClient.removeQueries({ queryKey: queryKeys.person(id) });
      // Invalidate the people list to refresh it
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

// Events hooks
export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: async () => {
      await delay(2000); // 2 second delay
      return api.getEvents();
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: async () => {
      await delay(2000); // 2 second delay
      return api.getEvent(id);
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
      await delay(2000); // 2 second delay
      return api.createEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...event }: { id: number } & Partial<Event>) => {
      await delay(2000); // 2 second delay
      return api.updateEvent(id, event);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await delay(2000); // 2 second delay
      return api.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

// Gift Ideas hooks
export const useGiftIdeas = () => {
  return useQuery({
    queryKey: ['giftIdeas'],
    queryFn: async () => {
      await delay(2000); // 2 second delay
      return api.getGiftIdeas();
    },
  });
};

export const useGiftIdea = (id: number) => {
  return useQuery({
    queryKey: ['giftIdea', id],
    queryFn: async () => {
      await delay(2000); // 2 second delay
      return api.getGiftIdea(id);
    },
    enabled: !!id,
  });
};

export const useGiftIdeasByPerson = (personId: number) => {
  const { data: allGiftIdeas = [] } = useGiftIdeas();
  
  return {
    data: allGiftIdeas.filter(giftIdea => giftIdea.person_id === personId),
    isLoading: false,
    error: null
  };
};

export const useCreateGiftIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (giftIdea: Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>) => {
      await delay(2000); // 2 second delay
      return api.createGiftIdea(giftIdea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateGiftIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...giftIdea }: { id: number } & Partial<GiftIdea>) => {
      await delay(2000); // 2 second delay
      return api.updateGiftIdea(id, giftIdea);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['giftIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['giftIdea', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const usePatchGiftIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...giftIdea }: { id: number } & Partial<GiftIdea>) => {
      await delay(2000); // 2 second delay
      return api.patchGiftIdea(id, giftIdea);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['giftIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['giftIdea', variables.id] });
    },
  });
};

export const useDeleteGiftIdea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteGiftIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Dashboard hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => api.getDashboardStats(),
  });
}