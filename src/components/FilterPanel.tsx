'use client';

import { useState } from 'react';
import { Filter, X, Save } from 'lucide-react';
import Button from './Button';
import Select from './Select';

type FilterOption = {
  id: string;
  label: string;
  type: 'select' | 'date' | 'checkbox';
  options?: { value: string; label: string }[];
};

type FilterPanelProps = {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
  savedFilters?: { name: string; filters: Record<string, any> }[];
};

export default function FilterPanel({ filters, onFilterChange, savedFilters = [] }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [filterName, setFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...activeFilters, [id]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).filter(key => activeFilters[key]).length;

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant={isOpen ? 'primary' : 'secondary'}
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Filter size={16} className="mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white text-[#563EB7] text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            <X size={16} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-gradient-to-br from-[#1a1333] to-[#14102a] border border-[#563EB7]/30 rounded-xl shadow-2xl shadow-black/50 p-6 z-50 animate-scaleIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Filter Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-4">
            {filters.map(filter => (
              <div key={filter.id}>
                {filter.type === 'select' && filter.options && (
                  <Select
                    label={filter.label}
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    options={[{ value: '', label: 'All' }, ...filter.options]}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-[#563EB7]/20">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowSaveDialog(!showSaveDialog)}
              className="flex-1"
            >
              <Save size={16} className="mr-1" />
              Save Filter
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

