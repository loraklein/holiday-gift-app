"use client";

import { useRouter } from 'next/navigation';
import { useState, Suspense, use } from 'react';
import { toast } from 'react-hot-toast';
import { useGiftIdea, usePatchGiftIdea, useDeleteGiftIdea, usePeople, useEvents } from '@/hooks/useApi';
import { GiftIdea } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EditGiftIdeaForm from './EditGiftIdeaForm';
import { ArrowLeft, Edit, Trash2, User, Calendar, Gift, DollarSign, Link as LinkIcon } from 'lucide-react';
import GiftIdeaLoading from '../loading';

interface GiftIdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

function GiftIdeaDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // API hooks
  const { data: giftIdea, error, isLoading } = useGiftIdea(parseInt(id));
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const patchGiftIdeaMutation = usePatchGiftIdea();
  const deleteGiftIdeaMutation = useDeleteGiftIdea();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (error || !giftIdea) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Error</h1>
        </div>
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {error ? 'Failed to load gift idea details.' : 'Gift idea not found.'}
            </p>
            <Button
              variant="primary"
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const person = people.find(p => p.id === giftIdea.person_id);
  const event = events.find(e => e.id === giftIdea.event_id);

  const handleDelete = async () => {
    try {
      await deleteGiftIdeaMutation.mutateAsync(giftIdea.id);
      toast.success('Gift idea deleted successfully');
      router.push('/gift-ideas');
    } catch (error) {
      toast.error('Failed to delete gift idea');
      console.error('Error deleting gift idea:', error);
    }
  };

  const handleUpdate = async (data: Partial<GiftIdea>) => {
    try {
      await patchGiftIdeaMutation.mutateAsync({ id: giftIdea.id, ...data });
      toast.success('Gift idea updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update gift idea');
      console.error('Error updating gift idea:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {giftIdea.idea}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="p-2"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Gift className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {giftIdea.idea}
              </h2>
              <div className="mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  giftIdea.status === 'given'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                    : giftIdea.status === 'purchased'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {giftIdea.status.charAt(0).toUpperCase() + giftIdea.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  For
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-white">
                  {person?.name || 'Unknown Person'}
                </dd>
              </div>
            </div>

            {event && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Event
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {event.name}
                  </dd>
                </div>
              </div>
            )}

            {giftIdea.price_range && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Price Range
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {giftIdea.price_range}
                  </dd>
                </div>
              </div>
            )}

            {giftIdea.url && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                  <LinkIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Link
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={giftIdea.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {giftIdea.url}
                    </a>
                  </dd>
                </div>
              </div>
            )}

            {giftIdea.description && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900/50 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {giftIdea.description}
                  </dd>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {isEditing && (
        <EditGiftIdeaForm
          giftIdea={giftIdea}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isSubmitting={patchGiftIdeaMutation.isPending}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Gift Idea"
          message="Are you sure you want to delete this gift idea? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isOpen={showDeleteConfirm}
        />
      )}
    </div>
  );
}

export default function GiftIdeaDetailPage({ params }: GiftIdeaDetailPageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<GiftIdeaLoading />}>
      <GiftIdeaDetailContent id={resolvedParams.id} />
    </Suspense>
  );
} 