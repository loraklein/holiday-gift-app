'use client';

import { useState, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useCreatePerson } from '@/hooks/useApi';
import { Person } from '@/lib/api';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import AddPersonForm from '@/components/people/AddPersonForm';
import { PeopleList } from '@/components/people/PeopleList';
import PeopleLoading from './loading';

function PeoplePageContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const createPersonMutation = useCreatePerson();

  const handleAddPerson = async (personData: Partial<Person>) => {
    try {
      await createPersonMutation.mutateAsync(personData as Omit<Person, 'id' | 'created_at' | 'updated_at'>);
      setShowAddForm(false);
      toast.success(`${personData.name} added successfully!`);
    } catch (error) {
      toast.error('Failed to add person. Please try again.');
      console.error('Error creating person:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          People
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </Button>
      </div>

      <PeopleList />

      {showAddForm && (
        <AddPersonForm
          onSubmit={handleAddPerson}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={createPersonMutation.isPending}
        />
      )}
    </div>
  );
}

export default function PeoplePage() {
  return (
    <Suspense fallback={<PeopleLoading />}>
      <PeoplePageContent />
    </Suspense>
  );
}