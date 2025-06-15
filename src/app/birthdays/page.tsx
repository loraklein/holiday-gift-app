"use client";

import { useState, Suspense } from 'react';
import { usePeople } from '@/hooks/useApi';
import { format, addYears, isToday } from 'date-fns';
import { Calendar, Gift, Car, List, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import BirthdaysLoading from './loading';

function BirthdaysPageContent() {
  const router = useRouter();
  const { data: people = [], isLoading } = usePeople();
  const [view, setView] = useState<'upcoming' | 'calendar'>('upcoming');
  const [showComingSoon, setShowComingSoon] = useState(false);

  if (isLoading) {
    return <BirthdaysLoading />;
  }

  // Get all people with birthdays
  const peopleWithBirthdays = people.filter(person => person.birthday);

  // Sort people by their next birthday
  const sortedBirthdays = peopleWithBirthdays
    .map(person => {
      const birthday = new Date(person.birthday!);
      const today = new Date();
      let nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      
      // If birthday already passed this year, get next year's
      if (nextBirthday < today) {
        nextBirthday = addYears(nextBirthday, 1);
      }

      return {
        ...person,
        nextBirthday,
        daysUntil: Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // Group birthdays by month (only used for calendar view)
  const birthdaysByMonth = sortedBirthdays.reduce((acc, person) => {
    const month = format(person.nextBirthday, 'MMMM');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(person);
    return acc;
  }, {} as Record<string, typeof sortedBirthdays>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Birthdays
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {peopleWithBirthdays.length} people with birthdays
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'upcoming' ? 'primary' : 'ghost'}
            onClick={() => setView('upcoming')}
            className="min-w-[120px]"
          >
            <List className="w-4 h-4 mr-2" />
            Upcoming
          </Button>
          <Button
            variant={view === 'calendar' ? 'primary' : 'ghost'}
            onClick={() => setView('calendar')}
            className="min-w-[120px]"
          >
            <Calendar className="w-4 h-4 mr-2" />
            By Month
          </Button>
        </div>
      </div>

      {view === 'upcoming' ? (
        <div className="space-y-4">
          {sortedBirthdays.map(person => (
            <Card key={person.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {person.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(person.nextBirthday, 'MMMM d')}
                      {isToday(person.nextBirthday) && (
                        <span className="ml-2 text-pink-600 dark:text-pink-400 font-medium">
                          (Today!)
                        </span>
                      )}
                      {!isToday(person.nextBirthday) && (
                        <span className="ml-2">
                          (in {person.daysUntil} days)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/gift-ideas/new?person_id=${person.id}&return_to=/birthdays`)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Gift className="w-4 h-4 mr-2 text-pink-500 dark:text-pink-400" />
                      Add Gift
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComingSoon(true)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Car className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Send Card
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(birthdaysByMonth).map(([month, birthdays]) => (
            <Card key={month} className="overflow-hidden">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  {month}
                </h2>
                <div className="space-y-0">
                  {birthdays.map((person, index) => (
                    <div
                      key={person.id}
                      className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        index !== birthdays.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-10 h-10 min-w-[2.5rem] border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {format(person.nextBirthday, 'd')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {person.name}
                        </span>
                        {isToday(person.nextBirthday) && (
                          <span className="text-pink-600 dark:text-pink-400">
                            🎉
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/people/${person.id}`)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Coming Soon!</h2>
              <button
                onClick={() => setShowComingSoon(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300">
                The card sending feature is coming soon! You&apos;ll be able to send birthday cards directly from the app.
              </p>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowComingSoon(false)}
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BirthdaysPage() {
  return (
    <Suspense fallback={<BirthdaysLoading />}>
      <BirthdaysPageContent />
    </Suspense>
  );
} 