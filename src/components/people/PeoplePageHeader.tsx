import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PeoplePageHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function PeoplePageHeader({ 
  onAddClick, 
  searchQuery, 
  onSearchChange 
}: PeoplePageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        People
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search people..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button
          onClick={onAddClick}
          variant="primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Person
        </Button>
      </div>
    </div>
  );
}