import { useState } from 'react';
import { X } from 'lucide-react';
import { GiftIdea, Person, Event } from '@/lib/api';

interface EditGiftIdeaFormProps {
  giftIdea: GiftIdea;
  people: Person[];
  events: Event[];
  onSubmit: (id: number, giftIdea: Partial<GiftIdea>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
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
    idea: giftIdea.idea || '',
    status: giftIdea.status,
    price_range: giftIdea.price_range?.toString() || '',
    url: giftIdea.url || '',
    description: giftIdea.description || '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.person_id || !formData.idea.trim()) {
      setError('Please select a person and enter a gift idea.');
      return;
    }

    if (formData.price_range && isNaN(Number(formData.price_range))) {
      setError('Please enter a valid price.');
      return;
    }

    if (formData.url && !isValidUrl(formData.url)) {
      setError('Please enter a valid URL.');
      return;
    }

    setError(null);
    
    const giftIdeaData = {
      person_id: Number(formData.person_id),
      event_id: formData.event_id ? Number(formData.event_id) : undefined,
      idea: formData.idea.trim(),
      status: formData.status,
      price_range: formData.price_range ? `$${formData.price_range}` : undefined,
      url: formData.url.trim() || undefined,
      description: formData.description.trim() || undefined,
    };

    onSubmit(giftIdea.id, giftIdeaData);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Gift Idea</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="edit-person_id" className="block text-sm font-medium text-gray-700 mb-1">
              Person *
            </label>
            <select
              id="edit-person_id"
              name="person_id"
              value={formData.person_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person.id} value={person.id.toString()}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-event_id" className="block text-sm font-medium text-gray-700 mb-1">
              Event (Optional)
            </label>
            <select
              id="edit-event_id"
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="">No specific event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id.toString()}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-idea" className="block text-sm font-medium text-gray-700 mb-1">
              Gift Idea *
            </label>
            <input
              type="text"
              id="edit-idea"
              name="idea"
              value={formData.idea}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter gift idea"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="idea">💡 Idea</option>
              <option value="purchased">🛒 Purchased</option>
              <option value="given">🎁 Given</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-price_range" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Price (Optional)
            </label>
            <input
              type="number"
              id="edit-price_range"
              name="price_range"
              value={formData.price_range}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 mb-1">
              URL (Optional)
            </label>
            <input
              type="url"
              id="edit-url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional notes..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting || !formData.person_id || !formData.idea.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}