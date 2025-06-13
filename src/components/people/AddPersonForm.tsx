'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Person } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface AddPersonFormProps {
  onSubmit: (personData: Partial<Person>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function AddPersonForm({ onSubmit, onCancel, isSubmitting }: AddPersonFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    birthday: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSubmit({
      name: formData.name.trim(),
      relationship: formData.relationship || undefined,
      birthday: formData.birthday || undefined,
      notes: formData.notes.trim() || undefined,
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Person</h2>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter person's name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Relationship
            </label>
            <select
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="">Select relationship</option>
              <option value="family">Family</option>
              <option value="friend">Friend</option>
              <option value="coworker">Coworker</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Birthday
            </label>
            <Input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
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
              disabled={!formData.name.trim()}
            >
              Add Person
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}