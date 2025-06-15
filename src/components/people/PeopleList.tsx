'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { usePeople } from '@/hooks/useApi';
import PeopleLoading from '@/app/people/loading';
import PersonCard from './PersonCard';

export function PeopleList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: people = [], isLoading } = usePeople();

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    
    const query = searchQuery.toLowerCase();
    return people.filter(person =>
      person.name.toLowerCase().includes(query) ||
      person.relationship?.toLowerCase().includes(query) ||
      person.notes?.toLowerCase().includes(query)
    );
  }, [people, searchQuery]);

  if (isLoading) {
    return <PeopleLoading />;
  }

  if (filteredPeople.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No people found
        </p>
        <Button
          onClick={() => router.push("/people/new")}
        >
          Add Your First Person
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {searchQuery && (
            <Button
              variant="secondary"
              onClick={() => setSearchQuery('')}
              className="flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} onClick={() => router.push(`/people/${person.id}`)} />
          ))}
        </div>
      </div>
    </Card>
  );
}