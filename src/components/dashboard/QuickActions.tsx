"use client";

import Link from 'next/link';
import { Gift, Users, Calendar } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';

export default function QuickActions() {
  return (
    <Card>
      <CardHeader title="Quick Actions" showBorder={false} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-4">
        <QuickActionButton
          href="/people/new"
          icon={Users}
          label="Add Person"
          description="Add someone new to your list"
        />
        <QuickActionButton
          href="/events/new"
          icon={Calendar}
          label="Add Event"
          description="Create a new event or holiday"
        />
        <QuickActionButton
          href="/gift-ideas/new"
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
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
        <div className="flex items-center mb-2">
          <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-3">
            <Icon size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  );
}