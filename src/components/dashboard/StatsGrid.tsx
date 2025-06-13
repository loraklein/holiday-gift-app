'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Gift, Users } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import { usePeople, useEvents, useGiftIdeas } from '@/hooks/useApi';

export default function StatsGrid() {
  const router = useRouter();
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const { data: giftIdeas = [] } = useGiftIdeas();

  const stats = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 30);

    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate >= now && eventDate <= next;
    });

    // Get upcoming gift ideas by checking their associated events
    const upcomingGiftIdeas = giftIdeas.filter(gift => {
      if (!gift.event_id) return false;
      const associatedEvent = events.find(event => event.id === gift.event_id);
      if (!associatedEvent) return false;
      const eventDate = new Date(associatedEvent.event_date);
      return eventDate >= now && eventDate <= next;
    });

    return [
      {
        title: 'Total People',
        value: people.length,
        icon: Users,
        color: 'blue',
        onClick: () => router.push('/people'),
      },
      {
        title: 'Upcoming Events',
        value: upcomingEvents.length,
        icon: Calendar,
        color: 'green',
        onClick: () => router.push('/events'),
      },
      {
        title: 'Upcoming Gifts',
        value: upcomingGiftIdeas.length,
        icon: Gift,
        color: 'purple',
        onClick: () => router.push('/gift-ideas'),
      },
    ];
  }, [people.length, events, giftIdeas, router]);

  return (
    <Card>
      <CardHeader title="Overview" showBorder={false} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-4">
        {stats.map((stat) => (
          <button
            key={stat.title}
            onClick={stat.onClick}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{stat.title}</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}