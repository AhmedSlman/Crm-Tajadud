'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Content } from '@/types';
import { FileText, Video, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type SocialCalendarViewProps = {
  month: Date;
  projectId: string;
  content: Content[];
  onRefresh?: () => void;
};

export default function SocialCalendarView({ month, projectId, content, onRefresh }: SocialCalendarViewProps) {
  const { updateContent } = useData();
  const [draggedItem, setDraggedItem] = useState<Content | null>(null);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get ready content (approved and ready for calendar, not yet scheduled)
  const readyContent = content.filter(c => 
    c.projectId === projectId && 
    c.readyForCalendar === true &&
    !c.publishDate // Only show content that hasn't been scheduled yet
  );

  // Get content for calendar (scheduled or published)
  const calendarContent = content.filter(c => 
    c.projectId === projectId && 
    (c.status === 'scheduled' || c.status === 'published')
  );

  const getContentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarContent.filter(c => c.publishDate === dateStr);
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

  const handleDragStart = (item: Content) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (date: Date) => {
    if (!draggedItem) return;

    const dateStr = date.toISOString().split('T')[0];
    
    try {
      await updateContent(draggedItem.id, {
        publishDate: dateStr,
        status: 'scheduled',
      });

      toast.success(`${draggedItem.title} scheduled! 📅`, {
        description: `Will be published on ${new Date(dateStr).toLocaleDateString()}`,
      });
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to schedule content');
    }

    setDraggedItem(null);
  };

  const handleMarkPublished = async (contentId: string) => {
    const item = content.find(c => c.id === contentId);
    try {
      await updateContent(contentId, { status: 'published' });
      toast.success(`${item?.title} published! 🎉`, {
        description: 'Content is now live',
      });
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to publish content');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Social Calendar</h2>
        <p className="text-sm text-gray-400">
          Drag and drop content items to schedule them on the calendar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ready Content Sidebar */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-4">Ready Content</h3>
          <div className="space-y-2">
            {readyContent.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">
                No content ready yet. Complete content in Content Plan or Reels Plan.
              </p>
            ) : (
              readyContent.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  className="bg-[#1a1333] border border-[#563EB7]/20 rounded-lg p-3 cursor-move hover:border-[#563EB7]/40 transition-all"
                >
                  <div className="flex items-start gap-2">
                    {item.isReel ? (
                      <Video size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FileText size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.isReel ? 'Reel' : 'Content'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">
              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
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

              const date = new Date(year, monthIndex, day);
              const dayContent = getContentForDate(date);
              const isToday = 
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(date)}
                  className={`min-h-24 bg-[#1a1333] rounded-lg p-2 border ${
                    isToday ? 'border-[#563EB7] shadow-lg shadow-[#563EB7]/20' : 'border-[#563EB7]/10'
                  } hover:border-[#563EB7]/30 transition-colors`}
                >
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#563EB7]' : 'text-white'}`}>
                    {day}
                  </div>
                  
                  <div className="space-y-1">
                    {dayContent.map(item => (
                      <div
                        key={item.id}
                        className={`text-xs p-1.5 rounded flex items-center gap-1 ${
                          item.status === 'published' 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-blue-500/20 border border-blue-500/30'
                        }`}
                      >
                        {item.isReel ? (
                          <Video size={10} className="flex-shrink-0" />
                        ) : (
                          <FileText size={10} className="flex-shrink-0" />
                        )}
                        <span className="truncate flex-1 text-white">{item.title}</span>
                        {item.status === 'scheduled' && (
                          <button
                            onClick={() => handleMarkPublished(item.id)}
                            className="flex-shrink-0 p-0.5 hover:bg-green-500/30 rounded transition-colors"
                            title="Mark as Published"
                          >
                            <CheckCircle size={10} className="text-green-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded" />
            <span className="text-gray-300">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded" />
            <span className="text-gray-300">Published</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-blue-400" />
            <span className="text-gray-300">Regular Content</span>
          </div>
          <div className="flex items-center gap-2">
            <Video size={14} className="text-purple-400" />
            <span className="text-gray-300">Reel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

