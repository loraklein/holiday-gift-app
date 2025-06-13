"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Users, Calendar } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import AddPersonForm from '@/components/people/AddPersonForm';
import AddGiftIdeaForm from '@/components/gift-ideas/AddGiftIdeaForm';
import AddEventForm from '@/components/events/AddEventForm';
import { useCreatePerson, useCreateGiftIdea, useCreateEvent, usePeople, useEvents } from '@/hooks/useApi';
import { Person, GiftIdea, Event } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function QuickActions() {
  const router = useRouter();
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [showAddGiftIdeaForm, setShowAddGiftIdeaForm] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const createPersonMutation = useCreatePerson();
  const createGiftIdeaMutation = useCreateGiftIdea();
  const createEventMutation = useCreateEvent();
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();

  const handleAddPerson = async (personData: Partial<Person>) => {
    try {
      await createPersonMutation.mutateAsync(personData as Omit<Person, 'id' | 'created_at' | 'updated_at'>);
      setShowAddPersonForm(false);
      toast.success(`${personData.name} added successfully!`);
      router.push('/people');
    } catch (error) {
      console.error('Failed to add person:', error);
      toast.error('Failed to add person');
    }
  };

  const handleAddGiftIdea = async (giftIdeaData: Partial<GiftIdea>) => {
    try {
      await createGiftIdeaMutation.mutateAsync(giftIdeaData as Omit<GiftIdea, 'id' | 'created_at' | 'updated_at'>);
      setShowAddGiftIdeaForm(false);
      toast.success('Gift idea added successfully!');
      router.push('/gift-ideas');
    } catch (error) {
      console.error('Failed to add gift idea:', error);
      toast.error('Failed to add gift idea');
    }
  };

  const handleAddEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createEventMutation.mutateAsync(eventData);
      setShowAddEventForm(false);
      toast.success(`${eventData.name} added successfully!`);
      router.push('/events');
    } catch (error) {
      console.error('Failed to add event:', error);
      toast.error('Failed to add event');
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Quick Actions" showBorder={false} />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-4">
          <QuickActionButton
            onClick={() => setShowAddPersonForm(true)}
            icon={Users}
            label="Add Person"
            description="Add someone new to your list"
          />
          <QuickActionButton
            onClick={() => setShowAddEventForm(true)}
            icon={Calendar}
            label="Add Event"
            description="Create a new event or holiday"
          />
          <QuickActionButton
            onClick={() => setShowAddGiftIdeaForm(true)}
            icon={Gift}
            label="Add Gift Idea"
            description="Save a new gift idea"
          />
        </div>
      </Card>

      {showAddPersonForm && (
        <AddPersonForm
          onSubmit={handleAddPerson}
          onCancel={() => setShowAddPersonForm(false)}
          isSubmitting={createPersonMutation.isPending}
        />
      )}

      {showAddEventForm && (
        <AddEventForm
          onSubmit={handleAddEvent}
          onCancel={() => setShowAddEventForm(false)}
          isSubmitting={createEventMutation.isPending}
        />
      )}

      {showAddGiftIdeaForm && (
        <AddGiftIdeaForm
          onSubmit={handleAddGiftIdea}
          onCancel={() => setShowAddGiftIdeaForm(false)}
          isSubmitting={createGiftIdeaMutation.isPending}
          people={people}
          events={events}
        />
      )}
    </>
  );
}

function QuickActionButton({ onClick, icon: Icon, label, description }: {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-3">
            <Icon size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </button>
  );
}