"use client";

import { useState, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { EventsList } from '@/components/events/EventsList';
import AddEventForm from '@/components/events/AddEventForm';
import EventsLoading from './loading';
import { useCreateEvent } from '@/hooks/useApi';
import { Event } from '@/lib/api';

function EventsPageContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const createEventMutation = useCreateEvent();

  const handleAddEvent = async (eventData: Partial<Event>) => {
    try {
      await createEventMutation.mutateAsync(eventData as Omit<Event, 'id' | 'created_at' | 'updated_at'>);
      setShowAddForm(false);
      toast.success('Event added successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to add event. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Events
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <EventsList showPastEvents={showPastEvents} onShowPastEventsChange={setShowPastEvents} />

      {showAddForm && (
        <AddEventForm
          onSubmit={handleAddEvent}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={createEventMutation.isPending}
        />
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <EventsPageContent />
    </Suspense>
  );
}