'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useGiftIdeas } from '@/hooks/useApi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import GiftIdeaCard from './GiftIdeaCard';
import GiftIdeasLoading from '@/app/gift-ideas/loading';

export default function GiftIdeasList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: giftIdeas = [], isLoading } = useGiftIdeas();

  const filteredGiftIdeas = giftIdeas.filter(giftIdea =>
    giftIdea.idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
    giftIdea.person_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    giftIdea.event_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <GiftIdeasLoading />;
  }

  if (filteredGiftIdeas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No gift ideas found
        </p>
        <Button
          onClick={() => router.push("/gift-ideas/new")}
        >
          Add Your First Gift Idea
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGiftIdeas.map((giftIdea) => (
            <GiftIdeaCard
              key={giftIdea.id}
              giftIdea={giftIdea}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}