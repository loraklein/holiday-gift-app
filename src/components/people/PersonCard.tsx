'use client';

import { Edit, Trash2, Calendar, User } from 'lucide-react';
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
        return 'bg-blue-100 text-blue-800';
      case 'friend':
        return 'bg-green-100 text-green-800';
      case 'coworker':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
            {person.relationship && (
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRelationshipColor(person.relationship)}`}>
                {person.relationship}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(person)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Edit ${person.name}`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(person.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Delete ${person.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {person.birthday && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar size={14} className="mr-2" />
          {formatBirthday(person.birthday)}
        </div>
      )}

      {person.email && (
        <div className="text-sm text-gray-600 mb-2">
          Email: {person.email}
        </div>
      )}

      {person.notes && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Notes:</strong> {person.notes}
        </div>
      )}
    </Card>
  );
}