'use client';

import { Gift, Users, Calendar, CheckCircle } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { usePeople } from '@/hooks/useApi';

export default function StatsGrid() {
  // Testing with people endpoint instead of dashboard stats
  const { data: people, isLoading, error } = usePeople();

  // Debug logging
  console.log('People data:', people);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Calculate stats from people data
  const displayStats = {
    totalPeople: people?.length || 8,
    totalEvents: 5, // Still mock for now
    totalGiftIdeas: 12, // Still mock for now  
    purchasedGifts: 3, // Still mock for now
  };

  if (error) {
    console.warn('Failed to load people data:', error);
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="People"
        value={isLoading ? 0 : displayStats.totalPeople}
        href="/people"
        color="blue"
      />
      <StatCard
        icon={Calendar}
        label="Events"
        value={displayStats.totalEvents}
        href="/events"
        color="green"
      />
      <StatCard
        icon={Gift}
        label="Gift Ideas"
        value={displayStats.totalGiftIdeas}
        href="/gift-ideas"
        color="purple"
      />
      <StatCard
        icon={CheckCircle}
        label="Purchased"
        value={displayStats.purchasedGifts}
        href="/gift-ideas?status=purchased"
        color="emerald"
      />
    </div>
  );
}