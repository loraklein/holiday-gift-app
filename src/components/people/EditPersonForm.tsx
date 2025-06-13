'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Person } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface EditPersonFormProps {
  person: Person;
  onSubmit: (personData: Partial<Person>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EditPersonForm({
  person,
  onSubmit,
  onCancel,
  isSubmitting,
}: EditPersonFormProps) {
  const [formData, setFormData] = useState({
    name: person.name,
    relationship: person.relationship || '',
    birthday: person.birthday ? new Date(person.birthday).toISOString().split('T')[0] : '',
    notes: person.notes || '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Edit Person
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="relationship"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Relationship
            </label>
            <Input
              id="relationship"
              name="relationship"
              type="text"
              value={formData.relationship}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Birthday
            </label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
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
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}