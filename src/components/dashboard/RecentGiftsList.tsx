import Card, { CardHeader } from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

const mockRecentGiftIdeas = [
  { id: 1, idea: 'Herb Garden Kit', person: 'Mom', status: 'idea' },
  { id: 2, idea: 'Gaming Headset', person: 'Jake', status: 'purchased' },
  { id: 3, idea: 'Designer Scarf', person: 'Sarah', status: 'purchased' },
  { id: 4, idea: 'Golf Lessons', person: 'Dad', status: 'idea' },
];

export default function RecentGiftsList() {
  return (
    <Card>
      <CardHeader
        title="Recent Gift Ideas"
        action={{ label: "View all", href: "/gift-ideas" }}
      />
      <div className="space-y-3">
        {mockRecentGiftIdeas.map((gift) => (
          <GiftIdeaItem key={gift.id} gift={gift} />
        ))}
      </div>
    </Card>
  );
}

function GiftIdeaItem({ gift }: { gift: typeof mockRecentGiftIdeas[0] }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-900">{gift.idea}</h3>
        <p className="text-sm text-gray-600">for {gift.person}</p>
      </div>
      <StatusBadge status={gift.status} />
    </div>
  );
}