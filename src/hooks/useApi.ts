import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Person, Event, GiftIdea } from '@/lib/api';

const queryKeys = {
  people: ['people'],
  person: (id: number) => ['person', id],
  events: ['events'],
  event: (id: number) => ['event', id],
  giftIdeas: ['giftIdeas'],
  giftIdea: (id: number) => ['giftIdea', id],
  dashboard: ['dashboard'],
  dashboardStats: ['dashboardStats']
} as const;

// People hooks
export function usePeople() {
  return useQuery({
    queryKey: queryKeys.people,
    queryFn: async () => {
      return api.getPeople();
    },
  });
}

export function usePerson(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.person(id),
    queryFn: async () => {
      return api.getPerson(id);
    },
    enabled: options?.enabled !== false && !!id,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (person: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
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
      return api.updatePerson(id, person);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.person(variables.id) });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
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
      return api.getEvents();
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: async () => {
      return api.getEvent(id);
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
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
      return api.updateEvent(id, event);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return api.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

// Gift Ideas hooks
export function useGiftIdeas() {
  return useQuery({
    queryKey: queryKeys.giftIdeas,
    queryFn: async () => {
      const giftIdeas = await api.getGiftIdeas();
      // Sort by id in descending order (newest first)
      return giftIdeas.sort((a, b) => b.id - a.id);
    },
  });
}

export function useGiftIdea(id: number) {
  return useQuery({
    queryKey: queryKeys.giftIdea(id),
    queryFn: async () => {
      return api.getGiftIdea(id);
    },
    enabled: !!id,
  });
}

export function useGiftIdeasByPerson(personId: number) {
  const { data: allGiftIdeas = [] } = useGiftIdeas();
  
  return {
    data: allGiftIdeas.filter(giftIdea => giftIdea.person_id === personId),
    isLoading: false,
    error: null
  };
}

export function useCreateGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (giftIdea: Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>) => {
      return api.createGiftIdea(giftIdea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...giftIdea }: { id: number } & Partial<GiftIdea>) => {
      return api.updateGiftIdea(id, giftIdea);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdea(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function usePatchGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...giftIdea }: { id: number } & Partial<GiftIdea>) => {
      return api.patchGiftIdea(id, giftIdea);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdea(variables.id) });
    },
  });
}

export function useDeleteGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return api.deleteGiftIdea(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

// Dashboard hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => api.getDashboardStats(),
  });
}