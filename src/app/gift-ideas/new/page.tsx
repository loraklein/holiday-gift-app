"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePeople, useEvents, useCreateGiftIdea } from '@/hooks/useApi';
import { GiftIdea } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { ArrowLeft } from 'lucide-react';

export default function NewGiftIdeaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personId = searchParams.get('personId');

  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const createGiftIdeaMutation = useCreateGiftIdea();

  const [formData, setFormData] = useState({
    person_id: personId ? parseInt(personId) : undefined,
    event_id: undefined as number | undefined,
    idea: '',
    status: 'idea' as GiftIdea['status'],
    price_range: '',
    url: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.person_id) {
      toast.error('Please select a person');
      return;
    }

    try {
      await createGiftIdeaMutation.mutateAsync({
        ...formData,
        person_id: formData.person_id,
        event_id: formData.event_id || undefined,
        price_range: formData.price_range || undefined,
        url: formData.url || undefined,
        description: formData.description || undefined
      });
      toast.success('Gift idea added successfully!');
      router.push('/gift-ideas');
    } catch (error) {
      toast.error('Failed to add gift idea. Please try again.');
      console.error('Error creating gift idea:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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
          Add New Gift Idea
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="person" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Person
            </label>
            <select
              id="person"
              value={formData.person_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, person_id: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a person</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event (Optional)
            </label>
            <select
              id="event"
              value={formData.event_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, event_id: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an event (optional)</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gift Idea
            </label>
            <Input
              id="idea"
              value={formData.idea}
              onChange={(e) => setFormData(prev => ({ ...prev, idea: e.target.value }))}
              placeholder="Enter your gift idea"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add any additional details about the gift idea"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="price_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range (Optional)
            </label>
            <Input
              id="price_range"
              value={formData.price_range}
              onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
              placeholder="e.g., $20-30"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL (Optional)
            </label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/product"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createGiftIdeaMutation.isPending}
            >
              Add Gift Idea
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 