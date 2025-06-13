'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/50" />
        </Transition>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                    isLoading={isLoading}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}