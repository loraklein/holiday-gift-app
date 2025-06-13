'use client';

import { Person } from '@/lib/api';
import PersonCard from './PersonCard';

interface PeopleListProps {
  people: Person[];
  isLoading?: boolean;
  onPersonClick?: (person: Person) => void;
  onDeleteClick?: (person: Person) => void;
}

export default function PeopleList({ people, isLoading, onPersonClick, onDeleteClick }: PeopleListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No people yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding someone to your list.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {people.map((person) => (
        <PersonCard 
          key={person.id} 
          person={person} 
          onClick={() => onPersonClick?.(person)}
          onDeleteClick={() => onDeleteClick?.(person)}
        />
      ))}
    </div>
  );
}