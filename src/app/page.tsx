import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import EventsList from '@/components/dashboard/EventsList';
import RecentGiftsList from '@/components/dashboard/RecentGiftsList';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <StatsGrid />
      
      <div className="grid lg:grid-cols-2 gap-6">
        <EventsList />
        <RecentGiftsList />
      </div>
      
      <QuickActions />
    </div>
  );
}