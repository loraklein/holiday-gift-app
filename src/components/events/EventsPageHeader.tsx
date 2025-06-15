import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EventsPageHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showPastEvents: boolean;
  onTogglePastEvents: () => void;
}

export default function EventsPageHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
  showPastEvents,
  onTogglePastEvents
}: EventsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Events
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showPastEvents}
              onChange={onTogglePastEvents}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Show Past Events
            </span>
          </label>
        </div>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button
          onClick={onAddClick}
          variant="primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
} 