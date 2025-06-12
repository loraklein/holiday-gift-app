import { useState } from 'react';
import { X } from 'lucide-react';
import { Event } from '@/lib/api';

interface EditEventFormProps {
  event: Event;
  onSubmit: (id: number, event: Partial<Event>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EditEventForm({ event, onSubmit, onCancel, isSubmitting }: EditEventFormProps) {
  const [formData, setFormData] = useState({
    name: event.name || '',
    date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '',
    description: event.description || '',
    event_type: event.event_type || '',
    recurring: event.recurring !== undefined ? event.recurring : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.date || !formData.event_type) return;
    onSubmit(event.id, {
      name: formData.name.trim(),
      event_date: formData.date,
      description: formData.description.trim() || undefined,
      event_type: formData.event_type,
      recurring: formData.recurring,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit {event.name}</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="edit-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="edit-event_type" className="block text-sm font-medium text-gray-700 mb-1">
              Event Type *
            </label>
            <select
              id="edit-event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="">Select type</option>
              <option value="holiday">Holiday</option>
              <option value="anniversary">Anniversary</option>
              <option value="special_occasion">Special Occasion</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-recurring"
              name="recurring"
              checked={formData.recurring}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mr-2"
            />
            <label htmlFor="edit-recurring" className="text-sm font-medium text-gray-700">
              Recurring
            </label>
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
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
              disabled={isSubmitting || !formData.name.trim() || !formData.date || !formData.event_type}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 