import { GiftIdea } from '@/lib/api';
import { Calendar, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GiftIdeaCardProps {
  giftIdea: GiftIdea;
  onStatusUpdate?: (id: number, status: 'idea' | 'purchased' | 'given') => void;
}

const STATUS_OPTIONS = [
  { value: 'idea' as const, label: 'Idea', color: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' },
  { value: 'purchased' as const, label: 'Purchased', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400' },
  { value: 'given' as const, label: 'Given', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400' }
] as const;

export default function GiftIdeaCard({ giftIdea, onStatusUpdate }: GiftIdeaCardProps) {
  const router = useRouter();
  const [updatingStatus, setUpdatingStatus] = useState<'idea' | 'purchased' | 'given' | null>(null);

  const handleStatusClick = async (e: React.MouseEvent, status: 'idea' | 'purchased' | 'given') => {
    e.stopPropagation();
    if (onStatusUpdate) {
      setUpdatingStatus(status);
      try {
        onStatusUpdate(giftIdea.id, status);
      } finally {
        setUpdatingStatus(null);
      }
    }
  };

  return (
    <Card className="p-6">
      <h3 
        className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:underline"
        onClick={() => router.push(`/gift-ideas/${giftIdea.id}`)}
      >
        {giftIdea.idea}
      </h3>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4 mr-2" />
          <span>{giftIdea.person_name}</span>
        </div>
        {giftIdea.event_name && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{giftIdea.event_name}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={(e) => handleStatusClick(e, value)}
              disabled={updatingStatus === value}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ease-in-out cursor-pointer relative ${
                value === giftIdea.status 
                  ? color 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700'
              }`}
            >
              <span className={`transition-opacity duration-200 ease-in-out ${updatingStatus === value ? 'opacity-0' : 'opacity-100'}`}>
                {label}
              </span>
              {updatingStatus === value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}