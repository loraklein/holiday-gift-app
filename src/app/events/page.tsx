"use client";

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { EventsList } from '@/components/events/EventsList';

export default function EventsPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Events
        </h1>
        <Button
          variant="primary"
          onClick={() => router.push('/events/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <EventsList />
    </div>
  );
}