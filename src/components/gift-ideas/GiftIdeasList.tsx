'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useGiftIdeas, usePeople, useEvents } from '@/hooks/useApi';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import GiftIdeaCard from './GiftIdeaCard';
import GiftIdeasLoading from '@/app/gift-ideas/loading';

export default function GiftIdeasList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: giftIdeas = [], isLoading: isLoadingGiftIdeas } = useGiftIdeas();
  const { data: people = [], isLoading: isLoadingPeople } = usePeople();
  const { data: events = [], isLoading: isLoadingEvents } = useEvents();

  const isLoading = isLoadingGiftIdeas || isLoadingPeople || isLoadingEvents;

  const filteredGiftIdeas = giftIdeas.filter(giftIdea => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      giftIdea.idea.toLowerCase().includes(query) ||
      giftIdea.description?.toLowerCase().includes(query) ||
      giftIdea.person_name?.toLowerCase().includes(query) ||
      giftIdea.event_name?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return <GiftIdeasLoading />;
  }

  if (filteredGiftIdeas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No gift ideas found
        </p>
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search gift ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredGiftIdeas.map((giftIdea) => (
            <GiftIdeaCard
              key={giftIdea.id}
              giftIdea={giftIdea}
              people={people}
              events={events}
              onEdit={(giftIdea) => router.push(`/gift-ideas/${giftIdea.id}/edit`)}
              onDelete={(id) => {
                // Handle delete in the parent component
                console.log('Delete gift idea:', id);
              }}
              onStatusUpdate={(id, status) => {
                // Handle status update in the parent component
                console.log('Update gift idea status:', id, status);
              }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}