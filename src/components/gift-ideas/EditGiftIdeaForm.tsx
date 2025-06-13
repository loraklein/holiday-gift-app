import { useState } from 'react';
import { X } from 'lucide-react';
import { GiftIdea, Person, Event } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface EditGiftIdeaFormProps {
  giftIdea: GiftIdea;
  people: Person[];
  events: Event[];
  onSubmit: (giftIdeaId: number, giftIdeaData: Partial<GiftIdea>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EditGiftIdeaForm({
  giftIdea,
  people,
  events,
  onSubmit,
  onCancel,
  isSubmitting
}: EditGiftIdeaFormProps) {
  const [formData, setFormData] = useState({
    person_id: giftIdea.person_id.toString(),
    event_id: giftIdea.event_id?.toString() || '',
    idea: giftIdea.idea,
    description: giftIdea.description || '',
    price_range: giftIdea.price_range || '',
    url: giftIdea.url || '',
    status: giftIdea.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.person_id || !formData.idea.trim()) return;

    onSubmit(giftIdea.id, {
      person_id: parseInt(formData.person_id),
      event_id: formData.event_id ? parseInt(formData.event_id) : undefined,
      idea: formData.idea.trim(),
      description: formData.description.trim() || undefined,
      price_range: formData.price_range.trim() || undefined,
      url: formData.url.trim() || undefined,
      status: formData.status
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Gift Idea</h2>
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
            <label htmlFor="edit-person_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Person *
            </label>
            <select
              id="edit-person_id"
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
            <label htmlFor="edit-event_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event (Optional)
            </label>
            <select
              id="edit-event_id"
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
            <label htmlFor="edit-idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gift Idea *
            </label>
            <Input
              type="text"
              id="edit-idea"
              name="idea"
              value={formData.idea}
              onChange={handleInputChange}
              placeholder="Enter gift idea"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="idea">💡 Idea</option>
              <option value="purchased">🛒 Purchased</option>
              <option value="given">🎁 Given</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleTextareaChange}
              rows={3}
              placeholder="Any additional details about the gift idea"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-price_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range (Optional)
            </label>
            <Input
              type="text"
              id="edit-price_range"
              name="price_range"
              value={formData.price_range}
              onChange={handleInputChange}
              placeholder="e.g., $20-30"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL (Optional)
            </label>
            <Input
              type="url"
              id="edit-url"
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}