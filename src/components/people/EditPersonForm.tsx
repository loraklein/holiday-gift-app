'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Person } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface EditPersonFormProps {
  person: Person;
  onSubmit: (personId: number, personData: Partial<Person>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EditPersonForm({ person, onSubmit, onCancel, isSubmitting }: EditPersonFormProps) {
  const [formData, setFormData] = useState({
    name: person.name || '',
    relationship: person.relationship || '',
    birthday: person.birthday ? new Date(person.birthday) : null as Date | null,
    notes: person.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    const personData: Partial<Person> = {
      name: formData.name.trim(),
      relationship: formData.relationship.trim() || undefined,
      birthday: formData.birthday ? formData.birthday.toISOString().split('T')[0] : undefined,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(person.id, personData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Person</h2>
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
              Name *
            </label>
            <Input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Relationship
            </label>
            <Input
              type="text"
              id="edit-relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              placeholder="Enter relationship"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Birthday
            </label>
            <DatePicker
              selected={formData.birthday}
              onChange={(date: Date | null) => setFormData(prev => ({ ...prev, birthday: date }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              dateFormat="MMMM d, yyyy"
              placeholderText="Select birthday"
              isClearable
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <Textarea
              id="edit-notes"
              name="notes"
              value={formData.notes}
              onChange={handleTextareaChange}
              placeholder="Enter any additional notes"
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}