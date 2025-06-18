import { Event } from '@/lib/api';
import { getNextOccurrence } from '@/utils/dateUtils';

export function useEventUtils() {
  const getEventStatus = (event: Event): 'upcoming' | 'past' | 'today' => {
    if (!event.event_date) return 'upcoming';
    
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate.getTime() === today.getTime()) {
      return 'today';
    }
    return eventDate > today ? 'upcoming' : 'past';
  };

  const getNextEventDate = (event: Event): Date | null => {
    return getNextOccurrence(event.event_date, event.recurring || false);
  };

  const formatEventDate = (date: Date | null): string => {
    if (!date) return 'No date set';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    getEventStatus,
    getNextEventDate,
    formatEventDate
  };
} 