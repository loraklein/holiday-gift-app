"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePeople, useEvents, useCreateGiftIdea } from '@/hooks/useApi';
import { GiftIdea } from '@/lib/api';
import Card from '@/components/ui/Card';
import AddGiftIdeaForm from '@/components/gift-ideas/AddGiftIdeaForm';
import { toast } from 'react-hot-toast';

function GiftIdeaFormWithParams() {
  const searchParams = useSearchParams();
  const personId = searchParams.get('person_id');
  const eventId = searchParams.get('event_id');
  const returnTo = searchParams.get('return_to');

  return (
    <NewGiftIdeaPageContent
      initialPersonId={personId ? parseInt(personId) : undefined}
      initialEventId={eventId ? parseInt(eventId) : undefined}
      returnTo={returnTo}
    />
  );
}

function NewGiftIdeaPageContent({ 
  initialPersonId, 
  initialEventId,
  returnTo 
}: { 
  initialPersonId?: number; 
  initialEventId?: number;
  returnTo?: string | null;
}) {
  const router = useRouter();
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const createGiftIdeaMutation = useCreateGiftIdea();

  const handleSubmit = async (giftIdeaData: Partial<GiftIdea>) => {
    try {
      await createGiftIdeaMutation.mutateAsync(giftIdeaData as Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>);
      toast.success('Gift idea added successfully!');
      // If we have a return path, go back there, otherwise go to gift ideas list
      router.push(returnTo || '/gift-ideas');
    } catch (error) {
      console.error('Failed to add gift idea:', error);
      toast.error('Failed to add gift idea');
    }
  };

  const handleCancel = () => {
    // If we have a return path, go back there, otherwise go to gift ideas list
    router.push(returnTo || '/gift-ideas');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add Gift Idea
          </h1>
          <AddGiftIdeaForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createGiftIdeaMutation.isPending}
            people={people}
            events={events}
            initialPersonId={initialPersonId}
            initialEventId={initialEventId}
          />
        </div>
      </Card>
    </div>
  );
}

export default function NewGiftIdeaPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <div className="p-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </Card>
      </div>
    }>
      <GiftIdeaFormWithParams />
    </Suspense>
  );
} 