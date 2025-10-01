'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

type MonthSelectorProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  availableMonths?: { month: number; year: number; count: number }[];
};

export default function MonthSelector({ selectedDate, onDateChange, availableMonths = [] }: MonthSelectorProps) {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const previousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    onDateChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const selectMonth = (month: number, year: number) => {
    onDateChange(new Date(year, month, 1));
    setShowMonthPicker(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#563EB7]/20 rounded-lg">
            <CalendarIcon className="text-[#563EB7]" size={24} />
          </div>
          <div>
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="text-lg font-bold text-white hover:text-[#a78bfa] transition-colors cursor-pointer"
            >
              {monthNames[currentMonth]} {currentYear}
            </button>
            <p className="text-xs text-gray-400">Monthly Project View</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 bg-[#1a1333] hover:bg-[#563EB7] text-gray-300 hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gradient-to-r from-[#563EB7] to-[#6d4dd4] hover:from-[#6d4dd4] hover:to-[#7c5fdc] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-[#563EB7]/30"
          >
            Today
          </button>
          
          <button
            onClick={nextMonth}
            className="p-2 bg-[#1a1333] hover:bg-[#563EB7] text-gray-300 hover:text-white rounded-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Available Months Picker */}
      {showMonthPicker && availableMonths.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/20 shadow-lg animate-scaleIn">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#563EB7]" />
            Available Months ({availableMonths.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {availableMonths.map((item, index) => {
              const isSelected = item.month === currentMonth && item.year === currentYear;
              return (
                <button
                  key={index}
                  onClick={() => selectMonth(item.month, item.year)}
                  className={`
                    p-3 rounded-lg border transition-all duration-300 group
                    ${isSelected 
                      ? 'bg-gradient-to-r from-[#563EB7] to-[#6d4dd4] border-[#563EB7] shadow-lg shadow-[#563EB7]/30' 
                      : 'bg-[#14102a] border-[#563EB7]/20 hover:border-[#563EB7]/50 hover:bg-[#1a1333]'
                    }
                  `}
                >
                  <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {monthNames[item.month].slice(0, 3)}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-purple-200' : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {item.year}
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-purple-300' : 'text-[#563EB7] group-hover:text-[#a78bfa]'}`}>
                    {item.count} items
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

