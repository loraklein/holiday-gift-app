"use client";

import { Gift } from 'lucide-react';
import Link from 'next/link';

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link
        href="/gift-ideas"
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">Add Gift Idea</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Record a new gift idea</p>
        </div>
      </Link>
    </div>
  );
} 