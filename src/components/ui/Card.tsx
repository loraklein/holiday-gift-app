import { ReactNode } from 'react';
import Link from 'next/link';

interface CardHeaderProps {
  title: string;
  action?: {
    label: string;
    href: string;
  };
  showBorder?: boolean;
}

export function CardHeader({ title, action, showBorder = true }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 ${showBorder ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}