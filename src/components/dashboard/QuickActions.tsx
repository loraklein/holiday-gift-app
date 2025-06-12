import Link from 'next/link';
import { Gift, Users, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function QuickActions() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionButton
          href="/people"
          icon={Users}
          label="Add Person"
          description="Add someone new to your list"
        />
        <QuickActionButton
          href="/events"
          icon={Calendar}
          label="Add Event"
          description="Create a new event or holiday"
        />
        <QuickActionButton
          href="/gift-ideas"
          icon={Gift}
          label="Add Gift Idea"
          description="Save a new gift idea"
        />
      </div>
    </Card>
  );
}

function QuickActionButton({ href, icon: Icon, label, description }: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
        <div className="flex items-center mb-2">
          <Icon size={20} className="text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-900">{label}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}