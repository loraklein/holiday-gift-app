'use client';

import { Gift, Users, Calendar, Cake } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { usePeople, useEvents, useGiftIdeas } from '@/hooks/useApi';

export default function StatsGrid() {
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const { data: giftIdeas = [] } = useGiftIdeas();

  // Count people with birthdays
  const peopleWithBirthdays = people.filter(person => person.birthday).length;

  const displayStats = {
    people: {
      label: "People",
      value: people.length,
      icon: Users,
      color: "blue",
      href: "/people",
    },
    events: {
      label: "Events",
      value: events.length,
      icon: Calendar,
      color: "green",
      href: "/events",
    },
    birthdays: {
      label: "Birthdays",
      value: peopleWithBirthdays,
      icon: Cake,
      color: "pink",
      href: "/people",
    },
    giftIdeas: {
      label: "Gift Ideas",
      value: giftIdeas.length,
      icon: Gift,
      color: "purple",
      href: "/gift-ideas",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(displayStats).map(([key, stat]) => (
        <StatCard
          key={key}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          href={stat.href}
        />
      ))}
    </div>
  );
}