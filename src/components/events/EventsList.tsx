'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useEvents, useDeleteEvent } from '@/hooks/useApi';
import { useEventUtils } from '@/hooks/useEventUtils';
import EventsLoading from '@/app/events/loading';
import EventCard from './EventCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';

interface EventsListProps {
  showPastEvents: boolean;
  onShowPastEventsChange: (show: boolean) => void;
}

export function EventsList({ showPastEvents, onShowPastEventsChange }: EventsListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const { getNextEventDate } = useEventUtils();

  const { data: events = [], isLoading } = useEvents();
  const deleteEventMutation = useDeleteEvent();

  const handleDelete = async (id: number) => {
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success('Event deleted successfully');
      setEventToDelete(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = useMemo(() => {
    let result = events;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      );
    }
    
    // Skip events with invalid or empty dates
    result = result.filter(event => {
      if (!event.event_date) return false;
      
      try {
        const testDate = new Date(event.event_date);
        if (isNaN(testDate.getTime())) return false;
      } catch {
        return false;
      }
      
      const eventDate = new Date(event.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      // Calculate 6 months from today
      const sixMonthsFromNow = new Date(today);
      sixMonthsFromNow.setMonth(today.getMonth() + 6);
      
      // For recurring events, determine if they're upcoming or past based on next occurrence
      if (event.recurring !== false) {
        const nextOccurrence = getNextEventDate(event);
        if (!nextOccurrence) return false;
        
        if (showPastEvents) {
          // For past events view, show recurring events that have already occurred
          return nextOccurrence < today;
        } else {
          // For upcoming events view, show recurring events within next 6 months
          return nextOccurrence >= today && nextOccurrence <= sixMonthsFromNow;
        }
      }
      
      // For non-recurring events, check if they're within the next 6 months
      if (showPastEvents) {
        return eventDate < today;
      } else {
        return eventDate >= today && eventDate <= sixMonthsFromNow;
      }
    });
    
    // Sort by next occurrence
    return result.slice().sort((a, b) => {
      const aNext = getNextEventDate(a) || new Date(8640000000000000);
      const bNext = getNextEventDate(b) || new Date(8640000000000000);
      return showPastEvents ? bNext.getTime() - aNext.getTime() : aNext.getTime() - bNext.getTime();
    });
  }, [events, searchQuery, showPastEvents, getNextEventDate]);

  if (isLoading) {
    return <EventsLoading />;
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No events found
        </p>
        <Button
          onClick={() => router.push("/events/new")}
        >
          Add Your First Event
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showPastEvents}
                onChange={() => onShowPastEventsChange(!showPastEvents)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Show Past Events
              </span>
            </label>
            <div className="w-[120px]">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  onShowPastEventsChange(false);
                }}
                className={`whitespace-nowrap transition-opacity duration-200 ${
                  searchQuery || showPastEvents ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={eventToDelete !== null}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => eventToDelete && handleDelete(eventToDelete)}
        onCancel={() => setEventToDelete(null)}
        isLoading={deleteEventMutation.isPending}
      />
    </Card>
  );
} 