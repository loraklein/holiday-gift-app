import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Person, Event, GiftIdea } from '@/lib/api';

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
    queryFn: () => api.getPeople(),
  });
}

export function usePerson(id: number) {
  return useQuery({
    queryKey: queryKeys.person(id),
    queryFn: () => api.getPerson(id),
    enabled: !!id,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (person: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => 
      api.createPerson(person),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...person }: { id: number } & Partial<Person>) => 
      api.updatePerson(id, person),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.person(variables.id) });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

// Events hooks
export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: () => api.getEvents(),
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => api.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => 
      api.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...event }: { id: number } & Partial<Event>) => 
      api.updateEvent(id, event),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteEvent(id),
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
    queryFn: () => api.getGiftIdeas(),
  });
}

export function useGiftIdea(id: number) {
  return useQuery({
    queryKey: queryKeys.giftIdea(id),
    queryFn: () => api.getGiftIdea(id),
    enabled: !!id,
  });
}

export function useGiftIdeasByPerson(personId: number) {
  return useQuery({
    queryKey: queryKeys.giftIdeasByPerson(personId),
    queryFn: () => api.getGiftIdeasByPerson(personId),
    enabled: !!personId,
  });
}

export function useCreateGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (giftIdea: Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>) => 
      api.createGiftIdea(giftIdea),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeasByPerson(data.person_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useUpdateGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...giftIdea }: { id: number } & Partial<GiftIdea>) => 
      api.updateGiftIdea(id, giftIdea),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdea(variables.id) });
      if (data.person_id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeasByPerson(data.person_id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useDeleteGiftIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteGiftIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giftIdeas });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
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