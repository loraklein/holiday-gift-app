'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import AddGiftIdeaForm from './AddGiftIdeaForm';
import { usePeople } from '@/hooks/useApi';
import { useEvents } from '@/hooks/useApi';
import { useCreateGiftIdea } from '@/hooks/useApi';
import toast from 'react-hot-toast';

interface CreateGiftIdeaDialogProps {
  children: React.ReactNode;
}

export function CreateGiftIdeaDialog({ children }: CreateGiftIdeaDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: people = [] } = usePeople();
  const { data: events = [] } = useEvents();
  const createGiftIdeaMutation = useCreateGiftIdea();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (giftIdeaData: {
    person_id: number;
    event_id?: number;
    idea: string;
    description?: string;
    price_range?: string;
    url?: string;
  }) => {
    try {
      await createGiftIdeaMutation.mutateAsync({
        ...giftIdeaData,
        status: 'idea' // Default status for new gift ideas
      });
      toast.success('Gift idea created successfully!');
      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error('Failed to create gift idea');
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Add New Gift Idea
            </Dialog.Title>
            <div className="mt-4">
              <AddGiftIdeaForm
                people={people}
                events={events}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isSubmitting={createGiftIdeaMutation.isPending}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 