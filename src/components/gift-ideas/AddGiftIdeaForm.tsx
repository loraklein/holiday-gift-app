import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Person, Event } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface AddGiftIdeaFormProps {
  people: Person[];
  events: Event[];
  onSubmit: (giftIdeaData: {
    person_id: number;
    event_id?: number;
    idea: string;
    description?: string;
    price_range?: string;
    url?: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialPersonId?: number;
  initialEventId?: number;
}

export default function AddGiftIdeaForm({
  people,
  events,
  onSubmit,
  onCancel,
  isSubmitting,
  initialPersonId,
  initialEventId
}: AddGiftIdeaFormProps) {
  const [formData, setFormData] = useState({
    person_id: initialPersonId?.toString() || '',
    event_id: initialEventId?.toString() || '',
    idea: '',
    description: '',
    price_range: '',
    url: ''
  });

  useEffect(() => {
    if (initialPersonId) {
      setFormData(prev => ({ ...prev, person_id: initialPersonId.toString() }));
    }
    if (initialEventId) {
      setFormData(prev => ({ ...prev, event_id: initialEventId.toString() }));
    }
  }, [initialPersonId, initialEventId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.person_id || !formData.idea.trim()) return;

    onSubmit({
      person_id: parseInt(formData.person_id),
      event_id: formData.event_id ? parseInt(formData.event_id) : undefined,
      idea: formData.idea.trim(),
      description: formData.description.trim() || undefined,
      price_range: formData.price_range.trim() || undefined,
      url: formData.url.trim() || undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Gift Idea</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="person_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Person *
            </label>
            <select
              id="person_id"
              name="person_id"
              value={formData.person_id}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
              disabled={isSubmitting}
            >
              <option value="">Select person</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="event_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event (Optional)
            </label>
            <select
              id="event_id"
              name="event_id"
              value={formData.event_id}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="">Select event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gift Idea *
            </label>
            <Input
              type="text"
              id="idea"
              name="idea"
              value={formData.idea}
              onChange={handleInputChange}
              placeholder="Enter gift idea"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleTextareaChange}
              rows={3}
              placeholder="Any additional details about the gift idea"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="price_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range (Optional)
            </label>
            <Input
              type="text"
              id="price_range"
              name="price_range"
              value={formData.price_range}
              onChange={handleInputChange}
              placeholder="e.g., $20-30"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL (Optional)
            </label>
            <Input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com/product"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!formData.person_id || !formData.idea.trim()}
            >
              Add Gift Idea
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}