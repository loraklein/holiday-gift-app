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

  // Count upcoming events (within next 6 months)
  const upcomingEvents = events.filter(event => {
    if (!event.event_date) return false;
    
    try {
      const eventDate = new Date(event.event_date);
      if (isNaN(eventDate.getTime())) return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      // Calculate 6 months from today
      const sixMonthsFromNow = new Date(today);
      sixMonthsFromNow.setMonth(today.getMonth() + 6);
      
      // For recurring events, check if next occurrence is within 6 months
      if (event.recurring !== false) {
        const thisYear = today.getFullYear();
        let next = new Date(eventDate);
        next.setFullYear(thisYear);
        
        // If the event already happened this year, check next year
        if (next < today) {
          next.setFullYear(thisYear + 1);
        }
        
        return next >= today && next <= sixMonthsFromNow;
      }
      
      // For non-recurring events, check if they're within next 6 months
      return eventDate >= today && eventDate <= sixMonthsFromNow;
    } catch {
      return false;
    }
  });

  const displayStats = [
    {
      label: "People",
      value: people.length,
      icon: Users,
      href: "/people",
      color: "blue" as const,
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents.length,
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