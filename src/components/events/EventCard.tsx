import { Edit, Trash2, Calendar, Cake, PartyPopper, Heart, Smile } from 'lucide-react';
import { Event } from '@/lib/api';
import Card from '@/components/ui/Card';
import Link from "next/link";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

function getEventTypeIcon(event: Event, isBirthday: boolean) {
  if (isBirthday) return <Cake size={18} className="text-pink-500" />;
  switch (event.event_type) {
    case 'holiday':
      return <PartyPopper size={18} className="text-green-500" />;
    case 'anniversary':
      return <Heart size={18} className="text-red-500" />;
    case 'special_occasion':
      return <Smile size={18} className="text-yellow-500" />;
    default:
      return null;
  }
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const isBirthday = typeof event.id === 'string' && String(event.id).startsWith('birthday-');

  const displayDate = isBirthday
    ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    : new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {isBirthday ? (
              <Link href={`/people/${String(event.id).replace('birthday-', '')}`} className="hover:underline flex items-center gap-2">
                {event.name}
                {getEventTypeIcon(event, isBirthday)}
              </Link>
            ) : (
              <Link href={`/events/${event.id}`} className="hover:underline flex items-center gap-2">
                {event.name}
                {getEventTypeIcon(event, isBirthday)}
              </Link>
            )}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar size={14} className="mr-2" />
            {displayDate}
          </div>
          {event.description && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Description:</strong> {event.description}
            </div>
          )}
        </div>
        {!isBirthday && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label={`Edit ${event.name}`}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label={`Delete ${event.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
} 