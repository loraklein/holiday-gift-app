import { Calendar, Cake, PartyPopper, Heart, Smile } from 'lucide-react';
import { Event } from '@/lib/api';
import Card from '@/components/ui/Card';
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

function getEventTypeIcon(event: Event, isBirthday: boolean) {
  if (isBirthday) return <Cake size={18} className="text-pink-500 dark:text-pink-400" />;
  switch (event.event_type) {
    case 'holiday':
      return <PartyPopper size={18} className="text-green-500 dark:text-green-400" />;
    case 'anniversary':
      return <Heart size={18} className="text-red-500 dark:text-red-400" />;
    case 'special_occasion':
      return <Smile size={18} className="text-yellow-500 dark:text-yellow-400" />;
    default:
      return null;
  }
}

export default function EventCard({ event }: EventCardProps) {
  const isBirthday = typeof event.id === 'string' && String(event.id).startsWith('birthday-');

  const displayDate = isBirthday
    ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    : new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link 
        href={isBirthday ? `/people/${String(event.id).replace('birthday-', '')}` : `/events/${event.id}`}
        className="block"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {event.name}
                {getEventTypeIcon(event, isBirthday)}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                <Calendar size={14} className="mr-2" />
                {displayDate}
              </div>
              {event.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mt-3">
                  <strong>Description:</strong> {event.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
} 