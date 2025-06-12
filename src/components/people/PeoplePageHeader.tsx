import { Plus, Search } from 'lucide-react';

interface PeoplePageHeaderProps {
  totalCount: number;
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function PeoplePageHeader({ 
  totalCount, 
  onAddClick, 
  searchQuery, 
  onSearchChange 
}: PeoplePageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">People</h1>
          <p className="text-gray-600 mt-1">
            Manage your {totalCount} {totalCount === 1 ? 'person' : 'people'}
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Person
        </button>
      </div>

      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}