import { Gift, Users, Calendar, CheckCircle } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

// Mock data for now - TODO: replace with real API calls later
const mockStats = {
  totalPeople: 8,
  totalEvents: 5,
  totalGiftIdeas: 12,
  purchasedGifts: 3,
};

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="People"
        value={mockStats.totalPeople}
        href="/people"
        color="blue"
      />
      <StatCard
        icon={Calendar}
        label="Events"
        value={mockStats.totalEvents}
        href="/events"
        color="green"
      />
      <StatCard
        icon={Gift}
        label="Gift Ideas"
        value={mockStats.totalGiftIdeas}
        href="/gift-ideas"
        color="purple"
      />
      <StatCard
        icon={CheckCircle}
        label="Purchased"
        value={mockStats.purchasedGifts}
        href="/gift-ideas?status=purchased"
        color="emerald"
      />
    </div>
  );
}