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
  const personId = searchParams.get('personId');
  const eventId = searchParams.get('eventId');

  return (
    <NewGiftIdeaPageContent
      initialPersonId={personId ? parseInt(personId) : undefined}
      initialEventId={eventId ? parseInt(eventId) : undefined}
    />
  );
}

function NewGiftIdeaPageContent({ initialPersonId, initialEventId }: { initialPersonId?: number; initialEventId?: number }) {
  const router = useRouter();
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const createGiftIdeaMutation = useCreateGiftIdea();

  const handleSubmit = async (giftIdeaData: Partial<GiftIdea>) => {
    try {
      await createGiftIdeaMutation.mutateAsync(giftIdeaData as Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>);
      toast.success('Gift idea added successfully!');
      router.push('/gift-ideas');
    } catch (error) {
      console.error('Failed to add gift idea:', error);
      toast.error('Failed to add gift idea');
    }
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
            onCancel={() => router.push('/gift-ideas')}
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