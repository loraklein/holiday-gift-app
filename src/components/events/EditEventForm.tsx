import { useState } from 'react';
import { X } from 'lucide-react';
import { Event } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface EditEventFormProps {
  event: Event;
  onSubmit: (eventId: number, eventData: Partial<Event>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Event</h2>
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
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Name *
            </label>
            <Input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter event name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <Input
              type="date"
              id="edit-date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-event_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Type *
            </label>
            <select
              id="edit-event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="mr-2"
            />
            <label htmlFor="edit-recurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recurring
            </label>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleTextareaChange}
              rows={3}
              placeholder="Any additional notes..."
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
              disabled={!formData.name.trim() || !formData.date || !formData.event_type}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 