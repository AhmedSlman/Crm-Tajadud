'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import MonthSelector from '@/components/MonthSelector';
import ContentPlanTable from '@/components/ContentPlanTable';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Edit, 
  Clock,
  TrendingUp,
  DollarSign,
  Users as UsersIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { projects, tasks, campaigns, content, clients, users, updateTask, deleteTask, addTask } = useData();
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  const project = projects.find(p => p.id === projectId);
  const client = clients.find(c => c.id === project?.clientId);
  
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  // Filter data for selected month
  const monthlyTasks = useMemo(() => {
    return tasks.filter(task => {
      if (task.projectId !== projectId) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === selectedMonth && taskDate.getFullYear() === selectedYear;
    });
  }, [tasks, projectId, selectedMonth, selectedYear]);

  const monthlyCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      if (campaign.projectId !== projectId) return false;
      const campaignDate = new Date(campaign.startDate);
      return campaignDate.getMonth() === selectedMonth && campaignDate.getFullYear() === selectedYear;
    });
  }, [campaigns, projectId, selectedMonth, selectedYear]);

  const monthlyContent = useMemo(() => {
    return content.filter(item => {
      if (item.projectId !== projectId) return false;
      const contentDate = new Date(item.dueDate);
      return contentDate.getMonth() === selectedMonth && contentDate.getFullYear() === selectedYear;
    });
  }, [content, projectId, selectedMonth, selectedYear]);

  // Get available months with data
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    
    [...tasks, ...content, ...campaigns]
      .filter(item => item.projectId === projectId)
      .forEach(item => {
        const date = new Date('dueDate' in item ? item.dueDate : item.startDate);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        months.add(key);
      });

    return Array.from(months)
      .map(key => {
        const [year, month] = key.split('-').map(Number);
        const count = [...tasks, ...content, ...campaigns]
          .filter(item => {
            if (item.projectId !== projectId) return false;
            const date = new Date('dueDate' in item ? item.dueDate : item.startDate);
            return date.getMonth() === month && date.getFullYear() === year;
          }).length;
        return { month, year, count };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }, [tasks, content, campaigns, projectId]);

  // Social Calendar Data
  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const contentItems = monthlyContent.filter(item => {
      const publishDate = item.publishDate ? item.publishDate.split('T')[0] : null;
      const dueDate = item.dueDate.split('T')[0];
      return publishDate === dateStr || dueDate === dateStr;
    });

    const taskItems = monthlyTasks.filter(item => {
      const dueDate = item.dueDate.split('T')[0];
      return dueDate === dateStr;
    });

    return { contentItems, taskItems };
  };

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

  // Calendar Grid
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
  const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }, [startingDayOfWeek, daysInMonth]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Project not found</p>
        <Link href="/projects" className="text-[#563EB7] hover:text-[#6d4dd4] mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'completed': 'success',
      'in-progress': 'info',
      'planned': 'default',
      'on-hold': 'warning',
      'running': 'info',
    };
    return statusMap[status] || 'default';
  };

  const totalBudget = monthlyCampaigns.reduce((sum, c) => sum + c.budget, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <button className="p-2 bg-[#1a1333] hover:bg-[#563EB7] text-gray-300 hover:text-white rounded-lg transition-all duration-300">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              {project.name}
            </h1>
            <p className="text-gray-400 mt-1">{client?.name}</p>
          </div>
        </div>
        <Badge variant={getStatusBadge(project.status)}>
          {project.status.replace('-', ' ')}
        </Badge>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-[#563EB7] mb-2">{monthlyTasks.length}</div>
            <p className="text-sm text-gray-400">Tasks This Month</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{monthlyCampaigns.length}</div>
            <p className="text-sm text-gray-400">Active Campaigns</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{monthlyContent.filter(c => c.status === 'published').length}</div>
            <p className="text-sm text-gray-400">Published Content</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">${totalBudget.toLocaleString()}</div>
            <p className="text-sm text-gray-400">Total Budget</p>
          </div>
        </Card>
      </div>

      {/* Month Selector */}
      <MonthSelector 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate}
        availableMonths={availableMonths}
      />

      {/* Social Calendar */}
      <Card title="📅 Social Calendar - Monthly View">
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-gray-400 text-sm py-2">
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-24 bg-[#1a1333]/30 rounded-lg" />;
            }

            const date = new Date(selectedYear, selectedMonth, day);
            const { contentItems, taskItems } = getItemsForDate(date);
            const isToday = 
              date.getDate() === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`min-h-24 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-lg p-2 border transition-all duration-300 hover:scale-105 ${
                  isToday ? 'border-[#563EB7] shadow-lg shadow-[#563EB7]/30 ring-2 ring-[#563EB7]/50' : 'border-[#563EB7]/10 hover:border-[#563EB7]/30'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-[#563EB7]' : 'text-white'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {contentItems.slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      className="text-xs p-1 bg-[#563EB7]/20 rounded flex items-center gap-1 truncate hover:bg-[#563EB7]/30 transition-colors cursor-pointer"
                      title={item.title}
                    >
                      {getStatusIcon(item.status)}
                      <span className="truncate text-gray-300">{item.title}</span>
                    </div>
                  ))}
                  {taskItems.slice(0, 1).map(item => (
                    <div
                      key={item.id}
                      className="text-xs p-1 bg-blue-500/20 rounded flex items-center gap-1 truncate hover:bg-blue-500/30 transition-colors cursor-pointer"
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
      </Card>

      {/* Content Plan Table */}
      <Card>
        <ContentPlanTable
          tasks={monthlyTasks}
          onTaskUpdate={updateTask}
          onTaskDelete={deleteTask}
          onTaskAdd={addTask}
          users={users}
          clients={clients}
        />
      </Card>

      {/* Campaigns */}
      <Card title="🎯 Campaigns">
        {monthlyCampaigns.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No campaigns this month</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-5 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/20 hover:border-[#563EB7]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#563EB7]/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-white">{campaign.name}</h4>
                  <Badge variant={getStatusBadge(campaign.status)} size="sm">
                    {campaign.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white capitalize">{campaign.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Budget</span>
                    <span className="text-[#563EB7] font-semibold flex items-center gap-1">
                      <DollarSign size={14} />
                      {campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Objective</span>
                    <Badge variant="primary" size="sm">{campaign.objective}</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar progress={campaign.progress} showLabel size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Legend */}
      <Card title="Legend - Status Indicators">
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

