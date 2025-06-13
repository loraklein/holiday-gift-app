import { Edit, Trash2, ExternalLink, User, Calendar } from 'lucide-react';
import { GiftIdea, Person, Event } from '@/lib/api';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface GiftIdeaCardProps {
  giftIdea: GiftIdea;
  people: Person[];
  events: Event[];
  onEdit: (giftIdea: GiftIdea) => void;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: GiftIdea['status']) => void;
}

const statusConfig = {
  idea: { label: '💡 Idea', color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' },
  purchased: { label: '🛒 Purchased', color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' },
  given: { label: '🎁 Given', color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' },
};

export default function GiftIdeaCard({
  giftIdea,
  people,
  events,
  onEdit,
  onDelete,
  onStatusUpdate
}: GiftIdeaCardProps) {
  const person = people.find(p => p.id === giftIdea.person_id);
  const event = giftIdea.event_id ? events.find(e => e.id === giftIdea.event_id) : null;
  const currentStatus = statusConfig[giftIdea.status];

  const handleStatusChange = (newStatus: GiftIdea['status']) => {
    if (newStatus !== giftIdea.status) {
      onStatusUpdate(giftIdea.id, newStatus);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {giftIdea.idea}
            </h3>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User size={14} />
                <Link 
                  href={`/people/${person?.id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                >
                  {person?.name || 'Unknown Person'}
                </Link>
              </div>
              {event && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <Link 
                    href={`/events/${event.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                  >
                    {event.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(giftIdea)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
              aria-label={`Edit ${giftIdea.idea}`}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(giftIdea.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
              aria-label={`Delete ${giftIdea.idea}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {giftIdea.price_range && (
          <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 mb-3">
            <span>{giftIdea.price_range}</span>
          </div>
        )}

        {giftIdea.url && (
          <div className="flex items-center gap-1 mb-3">
            <a
              href={giftIdea.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
            >
              <ExternalLink size={14} />
              View Link
            </a>
          </div>
        )}

        {giftIdea.description && (
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-4">
            <strong>description:</strong> {giftIdea.description}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <select
            value={giftIdea.status}
            onChange={(e) => handleStatusChange(e.target.value as GiftIdea['status'])}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${currentStatus.color}`}
          >
            <option value="idea">💡 Idea</option>
            <option value="purchased">🛒 Purchased</option>
            <option value="given">🎁 Given</option>
          </select>
        </div>
      </div>
    </Card>
  );
}