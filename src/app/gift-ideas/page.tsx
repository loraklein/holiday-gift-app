"use client";

import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import GiftIdeasList from '@/components/gift-ideas/GiftIdeasList';
import { CreateGiftIdeaDialog } from '@/components/gift-ideas/create-gift-idea-dialog';
import GiftIdeasLoading from './loading';

export default function GiftIdeasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gift Ideas
        </h1>
        <CreateGiftIdeaDialog>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Gift Idea
          </Button>
        </CreateGiftIdeaDialog>
      </div>
      
      <Suspense fallback={<GiftIdeasLoading />}>
        <GiftIdeasList />
      </Suspense>
    </div>
  );
}