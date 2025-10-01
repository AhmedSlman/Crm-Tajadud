'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { ChevronLeft, ChevronRight, CheckCircle, Edit, Clock } from 'lucide-react';

export default function CalendarPage() {
  const { content, tasks } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const contentItems = content.filter(item => {
      const publishDate = item.publishDate ? item.publishDate.split('T')[0] : null;
      const dueDate = item.dueDate.split('T')[0];
      return publishDate === dateStr || dueDate === dateStr;
    });

    const taskItems = tasks.filter(item => {
      const dueDate = item.dueDate.split('T')[0];
      return dueDate === dateStr;
    });

    return { contentItems, taskItems };
  };

  const calendarDays = useMemo(() => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [startingDayOfWeek, daysInMonth]);

  const getStatusIcon = (status: string) => {
    if (status === 'published' || status === 'done') {
      return <CheckCircle size={12} className="text-green-400" />;
    } else if (status === 'in-progress' || status === 'review') {
      return <Edit size={12} className="text-blue-400" />;
    } else if (status === 'delayed') {
      return <Clock size={12} className="text-red-400" />;
    }
    return <Clock size={12} className="text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Social Calendar</h1>
          <p className="text-gray-400">View all scheduled content and tasks</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={previousMonth}>
                <ChevronLeft size={20} />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button size="sm" variant="secondary" onClick={nextMonth}>
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-gray-400 text-sm py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="min-h-24 bg-[#1a1333]/30 rounded-lg" />;
              }

              const date = new Date(year, month, day);
              const { contentItems, taskItems } = getItemsForDate(date);
              const isToday = 
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`min-h-24 bg-[#1a1333] rounded-lg p-2 border ${
                    isToday ? 'border-[#563EB7] shadow-lg shadow-[#563EB7]/20' : 'border-[#563EB7]/10'
                  } hover:border-[#563EB7]/30 transition-colors`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#563EB7]' : 'text-white'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {contentItems.slice(0, 2).map(item => (
                      <div
                        key={item.id}
                        className="text-xs p-1 bg-[#563EB7]/20 rounded flex items-center gap-1 truncate"
                        title={item.title}
                      >
                        {getStatusIcon(item.status)}
                        <span className="truncate text-gray-300">{item.title}</span>
                      </div>
                    ))}
                    {taskItems.slice(0, 1).map(item => (
                      <div
                        key={item.id}
                        className="text-xs p-1 bg-blue-500/20 rounded flex items-center gap-1 truncate"
                        title={item.title}
                      >
                        {getStatusIcon(item.status)}
                        <span className="truncate text-gray-300">{item.title}</span>
                      </div>
                    ))}
                    {contentItems.length + taskItems.length > 3 && (
                      <div className="text-xs text-gray-400 pl-1">
                        +{contentItems.length + taskItems.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card title="Legend">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-sm text-gray-300">Published / Done</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">In Progress / Review</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-red-400" />
            <span className="text-sm text-gray-300">Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-300">Planned / Scheduled</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

