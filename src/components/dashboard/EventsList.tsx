"use client";

import { useEvents } from "@/hooks/useApi";
import Card, { CardHeader } from '@/components/ui/Card';
import { daysUntil } from '@/lib/dateUtils';

export default function EventsList() {
  const { data: events = [], isLoading } = useEvents();

  // Get upcoming events sorted by date
  const upcomingEvents = events
    .filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.event_date);
      const dateB = new Date(b.event_date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3); // Show next 3 events

  if (isLoading) {
    return (
      <Card>
        <CardHeader
          title="Upcoming Events"
          action={{ label: "View all", href: "/events" }}
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

  return (
    <Card>
      <CardHeader
        title="Upcoming Events"
        action={{ label: "View all", href: "/events" }}
      />
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <EventItem key={event.id} event={event} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No upcoming events</p>
        )}
      </div>
    </Card>
  );
}

function EventItem({ event }: { event: { id: number; name: string; event_date: string; description?: string } }) {
  const eventDate = new Date(event.event_date);
  const daysAway = daysUntil(eventDate);
  
  const daysText = daysAway === 0 ? 'Today!' : 
                  daysAway === 1 ? 'Tomorrow' : 
                  `${daysAway} days`;
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{event.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{daysText}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {daysAway === 0 ? '' : daysAway <= 1 ? '' : 'away'}
        </p>
      </div>
    </div>
  );
}