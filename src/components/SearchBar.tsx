'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
};

export default function SearchBar({ 
  placeholder = 'Search...', 
  onSearch,
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#563EB7] transition-colors" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gradient-to-r from-[#1a1333] to-[#14102a] border border-[#563EB7]/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#563EB7] focus:shadow-lg focus:shadow-[#563EB7]/20 transition-all duration-300"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white hover:bg-[#563EB7] rounded-lg transition-all duration-300"
        >
          <X size={16} />
        </button>
      )}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#563EB7]/0 to-[#563EB7]/0 group-focus-within:from-[#563EB7]/5 group-focus-within:to-transparent transition-all duration-300 pointer-events-none" />
    </div>
  );
}

