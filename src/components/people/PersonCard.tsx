'use client';

import Link from 'next/link';
import { Person } from '@/lib/api';
import { User, Cake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  const formattedBirthday = person.birthday
    ? new Date(person.birthday).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <Link
      href={`/people/${person.id}`}
      className={cn(
        'block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800',
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {person.name}
          </h3>
          {formattedBirthday && (
            <p className="truncate text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Cake className="w-4 h-4" />
              {formattedBirthday}
            </p>
          )}
          {person.relationship && (
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {person.relationship}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}