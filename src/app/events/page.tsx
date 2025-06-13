"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/useApi";
import { Event } from "@/lib/api";
import EventsPageHeader from "@/components/events/EventsPageHeader";
import EventsList from "@/components/events/EventsList";
import AddEventForm from "@/components/events/AddEventForm";
import EditEventForm from "@/components/events/EditEventForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Listen for the showAddEventForm event
  useEffect(() => {
    const handleShowAddForm = () => {
      setShowAddForm(true);
    };

    window.addEventListener('showAddEventForm', handleShowAddForm);
    return () => {
      window.removeEventListener('showAddEventForm', handleShowAddForm);
    };
  }, []);

  // Show add form if coming from quick link
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setShowAddForm(true);
      // Update URL without triggering a page reload
      window.history.replaceState({}, '', '/events');
    }
  }, [searchParams]);

  // API hooks
  const { data: events = [], isLoading, error } = useEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  function getNextOccurrence(dateStr: string, recurring: boolean = true) {
    if (!dateStr) return new Date(8640000000000000); // far future for invalid dates
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date(8640000000000000); // far future for invalid dates
      }
      
      const today = new Date();
      const thisYear = today.getFullYear();
      let next = new Date(date);
      next.setFullYear(thisYear);
      
      // If the event already happened this year, set to next year (only if recurring)
      if (
        next.getMonth() < today.getMonth() ||
        (next.getMonth() === today.getMonth() && next.getDate() < today.getDate())
      ) {
        if (recurring) {
          next.setFullYear(thisYear + 1);
        } else {
          // For non-recurring, set to far future so it sorts last and can be filtered out
          next = new Date(8640000000000000);
        }
      }
      return next;
    } catch {
      return new Date(8640000000000000); // far future for invalid dates
    }
  }

  // Filter and sort events based on search query and next occurrence
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
        const nextOccurrence = getNextOccurrence(event.event_date, true);
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
      const aNext = getNextOccurrence(a.event_date, a.recurring !== false);
      const bNext = getNextOccurrence(b.event_date, b.recurring !== false);
      return showPastEvents ? bNext.getTime() - aNext.getTime() : aNext.getTime() - bNext.getTime();
    });
  }, [events, searchQuery, showPastEvents]);

  const handleAddEvent = async (
    eventData: Omit<Event, "id" | "created_at" | "updated_at">
  ) => {
    try {
      await createEventMutation.mutateAsync(eventData);
      setShowAddForm(false);
      toast.success(`${eventData.name} added successfully!`);
    } catch (error) {
      toast.error("Failed to add event. Please try again.");
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
  };

  const handleUpdateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      await updateEventMutation.mutateAsync({ id, ...eventData });
      setEventToEdit(null);
      toast.success("Event updated successfully!");
    } catch (error) {
      toast.error("Failed to update event. Please try again.");
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = (id: number) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    setEventToDelete(event);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEventMutation.mutateAsync(eventToDelete.id);
      toast.success(`${eventToDelete.name} deleted successfully.`);
      setEventToDelete(null);
    } catch (error) {
      toast.error("Failed to delete event. Please try again.");
      console.error("Error deleting event:", error);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <EventsPageHeader
          onAddClick={() => setShowAddForm(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showPastEvents={showPastEvents}
          onTogglePastEvents={() => setShowPastEvents(!showPastEvents)}
        />
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load events</h3>
          <p className="text-gray-600 mb-4">There was an error loading your events. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EventsPageHeader
        onAddClick={() => setShowAddForm(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showPastEvents={showPastEvents}
        onTogglePastEvents={() => setShowPastEvents(!showPastEvents)}
      />

      <EventsList
        events={filteredEvents}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        isLoading={isLoading}
      />

      {showAddForm && (
        <AddEventForm
          onSubmit={handleAddEvent}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={createEventMutation.isPending}
        />
      )}

      {eventToEdit && (
        <EditEventForm
          event={eventToEdit}
          onSubmit={handleUpdateEvent}
          onCancel={() => setEventToEdit(null)}
          isSubmitting={updateEventMutation.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={!!eventToDelete}
        title="Delete Event"
        message={`Are you sure you want to delete ${eventToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setEventToDelete(null)}
        isLoading={deleteEventMutation.isPending}
      />
    </div>
  );
}