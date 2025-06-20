"use client";

import { useState } from 'react';
import { GiftIdea } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { X } from 'lucide-react';
import { usePeople, useEvents } from '@/hooks/useApi';

interface EditGiftIdeaFormProps {
  giftIdea: GiftIdea;
  onSubmit: (data: Partial<GiftIdea>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EditGiftIdeaForm({ 
  giftIdea, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: EditGiftIdeaFormProps) {
  const [formData, setFormData] = useState({
    idea: giftIdea.idea,
    person_id: giftIdea.person_id,
    event_id: giftIdea.event_id || undefined,
    description: giftIdea.description || '',
    price_range: giftIdea.price_range || '',
    url: giftIdea.url || '',
    status: giftIdea.status
  });

  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();

  // Filter out invalid or past events, but include the current event if it exists
  const validEvents = events.filter(event => {
    // Always include the current event if it exists
    if (event.id === giftIdea.event_id) return true;
    
    if (!event.event_date) return false;
    
    try {
      const eventDate = new Date(event.event_date);
      if (isNaN(eventDate.getTime())) return false;
      
      // For non-recurring events, only show if they haven't passed
      if (event.recurring === false) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      }
      
      return true;
    } catch {
      return false;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idea.trim()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Gift Idea
            </h2>
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gift Idea
              </label>
              <Input
                id="idea"
                value={formData.idea}
                onChange={(e) => setFormData(prev => ({ ...prev, idea: e.target.value }))}
                placeholder="Enter gift idea"
                required
              />
            </div>

            <div>
              <label htmlFor="person" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                For
              </label>
              <select
                id="person"
                value={formData.person_id}
                onChange={(e) => setFormData(prev => ({ ...prev, person_id: parseInt(e.target.value) }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  event_id: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="">Select an event (optional)</option>
                {validEvents.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
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
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as GiftIdea['status'] }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              >
                <option value="idea">Idea</option>
                <option value="purchased">Purchased</option>
                <option value="given">Given</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
} 