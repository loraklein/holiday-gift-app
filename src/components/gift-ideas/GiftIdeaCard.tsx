import { GiftIdea } from '@/lib/api';
import { Gift, Calendar, User } from 'lucide-react';
import Card from '@/components/ui/Card';

interface GiftIdeaCardProps {
  giftIdea: GiftIdea;
}

export default function GiftIdeaCard({ giftIdea }: GiftIdeaCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Gift className="w-4 h-4 mr-2" />
          <span className="capitalize">{giftIdea.status}</span>
        </div>
      </div>
    </Card>
  );
}