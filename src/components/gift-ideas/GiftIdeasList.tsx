import { GiftIdea, Person, Event } from '@/lib/api';
import GiftIdeaCard from './GiftIdeaCard';

interface GiftIdeasListProps {
  giftIdeas: GiftIdea[];
  people: Person[];
  events: Event[];
  onEdit: (giftIdea: GiftIdea) => void;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: GiftIdea['status']) => void;
  isLoading?: boolean;
}

export default function GiftIdeasList({
  giftIdeas,
  people,
  events,
  onEdit,
  onDelete,
  onStatusUpdate,
  isLoading
}: GiftIdeasListProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (giftIdeas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No gift ideas yet</h3>
        <p className="text-gray-600 mb-4">Start by adding your first gift idea for someone special.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {giftIdeas.map((giftIdea) => (
        <GiftIdeaCard
          key={giftIdea.id}
          giftIdea={giftIdea}
          people={people}
          events={events}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
}