"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useApi';
import { Event } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ArrowLeft, Edit, Trash2, Calendar, Cake, PartyPopper, Heart, Smile, RefreshCw } from 'lucide-react';
import { use } from 'react';
import EditEventForm from '@/components/events/EditEventForm';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getEventTypeIcon(event: Partial<Event> & { isBirthday?: boolean }) {
  if (event.isBirthday) return <Cake size={20} className="text-pink-500 dark:text-pink-400" />;
  switch (event.event_type) {
    case "holiday":
      return <PartyPopper size={20} className="text-green-500 dark:text-green-400" />;
    case "anniversary":
      return <Heart size={20} className="text-red-500 dark:text-red-400" />;
    case "special_occasion":
      return <Smile size={20} className="text-yellow-500 dark:text-yellow-400" />;
    default:
      return null;
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { id } = use(params);

  // Handle birthday events
  const isBirthday = typeof id === 'string' && id.startsWith('birthday-');
  
  // Always call hooks at the top level
  const eventId = Number(id);
  const { data: event, isLoading, error } = useEvent(isBirthday ? 0 : eventId);
  
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  if (isBirthday) {
    // Extract personId from id
    const personId = id.replace('birthday-', '');
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Birthday Event</h1>
        </div>
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              This is a birthday event.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push(`/people/${personId}`)}
              className="mt-4"
            >
              View Person Details
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Error</h1>
        </div>
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {error ? 'Failed to load event details.' : 'Event not found.'}
            </p>
            <Button
              variant="primary"
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleUpdateEvent = async (eventId: number, updatedEvent: Partial<Event>) => {
    try {
      await updateEventMutation.mutateAsync({ id: eventId, ...updatedEvent });
      toast.success('Event updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventMutation.mutateAsync(event.id);
      toast.success('Event deleted successfully');
      router.replace('/events');
    } catch (error) {
      toast.error('Failed to delete event. Please try again.');
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {event.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="p-2"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <EditEventForm
          event={event}
          onSubmit={handleUpdateEvent}
          onCancel={() => setIsEditing(false)}
          isSubmitting={updateEventMutation.isPending}
        />
      ) : (
        <Card>
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                {getEventTypeIcon(event)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {event.name}
                </h2>
                {event.recurring && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <RefreshCw size={14} />
                    Recurring Event
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
              </div>

              {event.event_type && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <PartyPopper className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Type
                    </dt>
                    <dd className="mt-1 text-gray-900 dark:text-white capitalize">
                      {event.event_type.replace('_', ' ')}
                    </dd>
                  </div>
                </div>
              )}

              {event.description && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <Smile className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </dt>
                    <dd className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {event.description}
                    </dd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={deleteEventMutation.isPending}
      />
    </div>
  );
}