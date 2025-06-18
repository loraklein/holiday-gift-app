"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { usePerson, useUpdatePerson, useDeletePerson, useGiftIdeasByPerson } from '@/hooks/useApi';
import { Person } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ArrowLeft, Edit, Trash2, User, Heart, Cake, StickyNote, Gift, Plus } from 'lucide-react';
import { use } from 'react';
import EditPersonForm from '@/components/people/EditPersonForm';

interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PersonDetailPage({ params }: PersonDetailPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = use(params);
  console.log('Person ID:', id);

  const { data: person, isLoading, error } = usePerson(parseInt(id), {
    enabled: !isDeleting // Disable the query when deletion is in progress
  });
  const { data: giftIdeas = [], isLoading: isLoadingGiftIdeas } = useGiftIdeasByPerson(parseInt(id));
  
  console.log('Person data:', person);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
  console.log('Gift Ideas:', giftIdeas);
  console.log('Loading Gift Ideas:', isLoadingGiftIdeas);

  const updatePersonMutation = useUpdatePerson();
  const deletePersonMutation = useDeletePerson();

  useEffect(() => {
    if (error) {
      console.error('Error loading person:', error);
    }
  }, [error]);

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

  if (error || !person) {
    console.log('Rendering error state');
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
              {error ? 'Failed to load person details.' : 'Person not found.'}
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

  console.log('Rendering person details:', person);

  const handleUpdatePerson = async (personId: number, updatedPerson: Partial<Person>) => {
    try {
      await updatePersonMutation.mutateAsync({ id: personId, ...updatedPerson });
      toast.success('Person updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update person:', error);
      toast.error('Failed to update person');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true); // Disable the person query
      await deletePersonMutation.mutateAsync(person.id);
      toast.success(`${person.name} deleted successfully.`);
      router.replace('/people');
    } catch (error) {
      setIsDeleting(false); // Re-enable the query if deletion fails
      toast.error('Failed to delete person. Please try again.');
      console.error('Error deleting person:', error);
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
            {person.name}
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

      {isEditing ? (
        <EditPersonForm
          person={person}
          onSubmit={handleUpdatePerson}
          onCancel={() => setIsEditing(false)}
          isSubmitting={updatePersonMutation.isPending}
        />
      ) : (
        <>
          <Card>
            <div className="p-6 space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {person.name}
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {person.birthday && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                      <Cake className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Birthday
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {new Date(person.birthday).toLocaleDateString()}
                      </dd>
                    </div>
                  </div>
                )}

                {person.relationship && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Relationship
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-white">
                        {person.relationship}
                      </dd>
                    </div>
                  </div>
                )}

                {person.notes && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                      <StickyNote className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Notes
                      </dt>
                      <dd className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {person.notes}
                      </dd>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gift Ideas
                  </h2>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/gift-ideas/new?person_id=${person.id}&return_to=/people/${person.id}`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gift Idea
                </Button>
              </div>

              {giftIdeas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No gift ideas yet. Add your first gift idea!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {giftIdeas.map((giftIdea) => (
                    <div
                      key={giftIdea.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => router.push(`/gift-ideas/${giftIdea.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {giftIdea.idea}
                          </h3>
                          {giftIdea.price_range && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {giftIdea.price_range}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          giftIdea.status === 'purchased'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                            : giftIdea.status === 'given'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400'
                        }`}>
                          {giftIdea.status.charAt(0).toUpperCase() + giftIdea.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Person"
        message={`Are you sure you want to delete ${person.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={deletePersonMutation.isPending}
      />
    </div>
  );
} 