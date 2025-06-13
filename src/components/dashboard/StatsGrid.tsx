'use client';

import { usePeople, useEvents, useGiftIdeas } from "@/hooks/useApi";
import StatCard from '@/components/ui/StatCard';
import { Users, Calendar, Gift, Cake } from 'lucide-react';

export default function StatsGrid() {
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const { data: giftIdeas = [] } = useGiftIdeas();

  // Count people with birthdays
  const peopleWithBirthdays = people.filter(person => person.birthday).length;

  const displayStats = [
    {
      label: "People",
      value: people.length,
      icon: Users,
      href: "/people",
      color: "blue" as const,
    },
    {
      label: "Events",
      value: events.length,
      icon: Calendar,
      href: "/events",
      color: "green" as const,
    },
    {
      label: "Birthdays",
      value: peopleWithBirthdays,
      icon: Cake,
      href: "/people",
      color: "pink" as const,
    },
    {
      label: "Gift Ideas",
      value: giftIdeas.length,
      icon: Gift,
      href: "/gift-ideas",
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
      {displayStats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          href={stat.href}
          color={stat.color}
        />
      ))}
    </div>
  );
}