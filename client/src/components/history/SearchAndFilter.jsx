import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';

export function SearchAndFilter({
  search,
  onSearchChange,
  cropFilter,
  onCropFilterChange,
  sortOrder,
  onSortOrderChange,
  categories = []
}) {
  const sortOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' }
  ];

  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="w-full md:w-80">
        <Input
          placeholder="Search by crop, category, or location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
          className="mb-0"
        />
      </div>

      {/* Filters & Sorting */}
      <div className="w-full md:w-auto flex flex-wrap sm:flex-nowrap items-center gap-3">
        <div className="w-full sm:w-48">
          <Input
            placeholder="Filter crop (e.g. Rice)..."
            value={cropFilter}
            onChange={(e) => onCropFilterChange(e.target.value)}
            className="mb-0"
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            options={sortOptions}
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            className="mb-0"
          />
        </div>
      </div>
    </div>
  );
}
