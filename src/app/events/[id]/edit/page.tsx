'use client';

import { useRouter } from 'next/navigation';
import { Suspense, use } from 'react';
import { toast } from 'react-hot-toast';
import { useEvent, useUpdateEvent } from '@/hooks/useApi';
import { Event } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import EditEventForm from '@/components/events/EditEventForm';
import EventsLoading from '../../loading';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

function EditEventContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: event, error, isLoading } = useEvent(parseInt(id));
  const updateEventMutation = useUpdateEvent();

  if (isLoading) {
    return <EventsLoading />;
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Event
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error ? 'Failed to load event. Please try again.' : 'Event not found.'}
          </p>
          <Button
            variant="primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateEvent = async (eventId: number, eventData: Partial<Event>) => {
    try {
      console.log('Page component handling update with data:', eventData);
      await updateEventMutation.mutateAsync({ id: eventId, ...eventData });
      toast.success('Event updated successfully');
      router.push(`/events/${id}`);
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Event
        </h1>
      </div>

      <EditEventForm
        event={event}
        onSubmit={handleUpdateEvent}
        onCancel={() => router.back()}
        isSubmitting={updateEventMutation.isPending}
      />
    </div>
  );
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<EventsLoading />}>
      <EditEventContent id={resolvedParams.id} />
    </Suspense>
  );
} 