'use client';

import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { usePeople, useCreatePerson } from '@/hooks/useApi';
import { Person } from '@/lib/api';
import PeoplePageHeader from '@/components/people/PeoplePageHeader';
import PeopleList from '@/components/people/PeopleList';
import AddPersonForm from '@/components/people/AddPersonForm';

export default function PeoplePage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks
  const { data: people = [], isLoading, error } = usePeople();
  const createPersonMutation = useCreatePerson();

  // Filter people based on search query
  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    
    const query = searchQuery.toLowerCase();
    return people.filter(person =>
      person.name.toLowerCase().includes(query) ||
      person.relationship?.toLowerCase().includes(query) ||
      person.notes?.toLowerCase().includes(query)
    );
  }, [people, searchQuery]);

  const handleAddPerson = async (personData: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createPersonMutation.mutateAsync(personData);
      setShowAddForm(false);
      toast.success(`${personData.name} added successfully!`);
    } catch (error) {
      toast.error('Failed to add person. Please try again.');
      console.error('Error creating person:', error);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <PeoplePageHeader 
          onAddClick={() => setShowAddForm(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load people</h3>
          <p className="text-gray-600 mb-4">There was an error loading your people. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PeoplePageHeader
        onAddClick={() => setShowAddForm(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <PeopleList
        people={filteredPeople}
        isLoading={isLoading}
      />

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