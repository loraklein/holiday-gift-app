import Card, { CardHeader } from '@/components/ui/Card';
import { daysUntil, getNextMothersDay, getNextFathersDay, formatDate } from '@/lib/dateUtils';

// Calculate real upcoming events with accurate dates
function getUpcomingEvents() {
  const christmas = new Date(new Date().getFullYear(), 11, 25); // Dec 25
  const mothersDay = getNextMothersDay();
  const fathersDay = getNextFathersDay();
  
  // If Christmas has passed this year, use next year
  if (christmas < new Date()) {
    christmas.setFullYear(christmas.getFullYear() + 1);
  }
  
  const events = [
    {
      id: 1,
      name: 'Christmas',
      date: formatDate(christmas),
      daysAway: daysUntil(christmas)
    },
    {
      id: 2,
      name: "Mother's Day",
      date: formatDate(mothersDay),
      daysAway: daysUntil(mothersDay)
    },
    {
      id: 3,
      name: "Father's Day",
      date: formatDate(fathersDay),
      daysAway: daysUntil(fathersDay)
    },
  ];
  
  // Sort by days away and only show future events
  return events
    .filter(event => event.daysAway >= 0)
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 3); // Show next 3 events
}

export default function EventsList() {
  const upcomingEvents = getUpcomingEvents();

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
          <p className="text-gray-500 text-center py-4">No upcoming events</p>
        )}
      </div>
    </Card>
  );
}

function EventItem({ event }: { event: { id: number; name: string; date: string; daysAway: number } }) {
  const daysText = event.daysAway === 0 ? 'Today!' : 
                  event.daysAway === 1 ? 'Tomorrow' : 
                  `${event.daysAway} days`;
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-900">{event.name}</h3>
        <p className="text-sm text-gray-600">{event.date}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{daysText}</p>
        <p className="text-xs text-gray-500">
          {event.daysAway === 0 ? '' : event.daysAway <= 1 ? '' : 'away'}
        </p>
      </div>
    </div>
  );
}