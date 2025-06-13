import { Plus, Search, Filter, X } from 'lucide-react';
import { Person } from '@/lib/api';

interface GiftIdeasPageHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  personFilter: string;
  onPersonFilterChange: (personId: string) => void;
  people: Person[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function GiftIdeasPageHeader({
  onAddClick,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  personFilter,
  onPersonFilterChange,
  people,
  onClearFilters,
  hasActiveFilters
}: GiftIdeasPageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gift Ideas</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage gift ideas</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Gift Idea
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search gift ideas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="idea">💡 Ideas</option>
              <option value="purchased">🛒 Purchased</option>
              <option value="given">🎁 Given</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Person Filter */}
          <div className="relative">
            <select
              value={personFilter}
              onChange={(e) => onPersonFilterChange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
            >
              <option value="">All People</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={16} className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}