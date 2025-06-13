"use client";

import { useGiftIdeas, usePeople } from "@/hooks/useApi";
import Card, { CardHeader } from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

export default function RecentGiftsList() {
  const { data: giftIdeas = [], isLoading } = useGiftIdeas();
  const { data: people = [] } = usePeople();

  // Get the 3 most recent gift ideas
  const recentGiftIdeas = giftIdeas
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardHeader
          title="Recent Gift Ideas"
          action={{ label: "View all", href: "/gift-ideas" }}
        />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (recentGiftIdeas.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Recent Gift Ideas"
          action={{ label: "View all", href: "/gift-ideas" }}
        />
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No gift ideas yet</p>
          <Link 
            href="/gift-ideas"
            className="text-blue-600 hover:text-blue-800 hover:underline mt-2 inline-block"
          >
            Add your first gift idea
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Recent Gift Ideas"
        action={{ label: "View all", href: "/gift-ideas" }}
      />
      <div className="space-y-3">
        {recentGiftIdeas.map((gift) => {
          const person = people.find(p => p.id === gift.person_id);
          return (
            <div key={gift.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{gift.idea}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  for {person?.name || 'Unknown Person'}
                </p>
              </div>
              <StatusBadge status={gift.status} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}