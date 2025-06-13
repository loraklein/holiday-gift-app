'use client';

import { Edit, Trash2, Cake, User } from 'lucide-react';
import { Person } from '@/lib/api';
import Card from '@/components/ui/Card';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
}

export default function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const formatBirthday = (birthday: string) => {
    if (!birthday) return 'No birthday set';
    return new Date(birthday).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRelationshipColor = (relationship?: string) => {
    switch (relationship?.toLowerCase()) {
      case 'family':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'friend':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'coworker':
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{person.name}</h3>
              {person.relationship && (
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mt-1 ${getRelationshipColor(person.relationship)}`}>
                  {person.relationship}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(person)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
              aria-label={`Edit ${person.name}`}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(person.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
              aria-label={`Delete ${person.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {person.birthday && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            <Cake size={14} className="mr-2 text-pink-500 dark:text-pink-400" />
            {formatBirthday(person.birthday)}
          </div>
        )}

        {person.email && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Email: {person.email}
          </div>
        )}

        {person.notes && (
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <strong>Notes:</strong> {person.notes}
          </div>
        )}
      </div>
    </Card>
  );
}