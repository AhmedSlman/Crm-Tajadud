'use client';

import { useState, useEffect, useMemo } from 'react';
import { WorkItem, MyWorkStats } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import Select from '@/components/Select';
import SearchBar from '@/components/SearchBar';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  ChevronRight,
  Filter,
  Briefcase,
  Target,
  List,
  Grid3x3,
  Download
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatDate, getRelativeTime, searchInObject, exportToCSV } from '@/lib/utils';
import Link from 'next/link';

export default function MyWorkPage() {
  return (
    <ProtectedRoute>
      <MyWorkContent />
    </ProtectedRoute>
  );
}

function MyWorkContent() {
  const [myWork, setMyWork] = useState<WorkItem[]>([]);
  const [stats, setStats] = useState<MyWorkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'task' | 'content'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    loadMyWork();
  }, []);

  const loadMyWork = async () => {
    try {
      setLoading(true);
      const [workData, statsData] = await Promise.all([
        api.myWork.getAll(),
        api.myWork.getStats(),
      ]);
      
      setMyWork(workData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading my work:', error);
      toast.error('Failed to load your work');
    } finally {
      setLoading(false);
    }
  };

  const filteredWork = useMemo(() => {
    return myWork.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;
      
      // Priority filter
      if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
      
      // Status filter
      if (filterStatus === 'active') {
        if (item.type === 'task' && item.status === 'done') return false;
        if (item.type === 'content' && item.status === 'published') return false;
      } else if (filterStatus === 'completed') {
        if (item.type === 'task' && item.status !== 'done') return false;
        if (item.type === 'content' && item.status !== 'published') return false;
      } else if (filterStatus === 'overdue') {
        const isPastDue = new Date(item.dueDate) < new Date();
        if (!isPastDue) return false;
        if (item.type === 'task' && item.status === 'done') return false;
        if (item.type === 'content' && item.status === 'published') return false;
      } else if (filterStatus === 'due-today') {
        const today = new Date().toDateString();
        const itemDate = new Date(item.dueDate).toDateString();
        if (today !== itemDate) return false;
        if (item.type === 'task' && item.status === 'done') return false;
        if (item.type === 'content' && item.status === 'published') return false;
      } else if (filterStatus === 'this-week') {
        const now = new Date();
        const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const itemDate = new Date(item.dueDate);
        if (itemDate < now || itemDate > weekLater) return false;
        if (item.type === 'task' && item.status === 'done') return false;
        if (item.type === 'content' && item.status === 'published') return false;
      }
      
      // Search filter
      if (searchQuery && !searchInObject(item as unknown as Record<string, unknown>, searchQuery)) return false;
      
      return true;
    });
  }, [myWork, filterType, filterStatus, filterPriority, searchQuery]);

  const getStatusBadge = (item: WorkItem) => {
    const status = item.status as string;
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'done': 'success',
      'published': 'success',
      'completed': 'success',
      'in-progress': 'info',
      'running': 'info',
      'review': 'warning',
      'planned': 'default',
      'to-do': 'default',
      'idea': 'default',
      'delayed': 'danger',
      'on-hold': 'warning',
    };
    return statusMap[status] || 'default';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
      'urgent': 'danger',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return priorityMap[priority] || 'default';
  };

  const getTypeIcon = (item: WorkItem) => {
    if (item.type === 'task') {
      return <CheckSquare size={20} className="text-blue-400" />;
    } else {
      return <FileText size={20} className="text-purple-400" />;
    }
  };

  const isOverdue = (item: WorkItem) => {
    const isPastDue = new Date(item.dueDate) < new Date();
    const isNotDone = item.type === 'task' ? item.status !== 'done' : item.status !== 'published';
    return isPastDue && isNotDone;
  };

  const handleExport = () => {
    const exportData = filteredWork.map(item => ({
      Title: item.title,
      Type: item.type,
      Status: item.status,
      Priority: item.priority,
      Progress: `${item.progress}%`,
      'Due Date': item.dueDate,
      Project: item.projectName || 'N/A',
      'Task Type': item.taskType || item.contentType || '',
    }));
    
    exportToCSV(exportData, 'my-work');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#563EB7]/20 via-[#7c5fdc]/20 to-[#563EB7]/20 blur-3xl -z-10" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            My Work
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            All tasks and content assigned to you
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="text-blue-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-white">{stats.total}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Total Work</h3>
              <p className="text-xs text-gray-400">
                {stats.tasks.total} tasks, {stats.content.total} content
              </p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="text-red-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-white">{stats.tasks.overdue}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Overdue</h3>
              <p className="text-xs text-gray-400">Need immediate attention</p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="text-yellow-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-white">{stats.dueToday}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Due Today</h3>
              <p className="text-xs text-gray-400">Complete today</p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-green-400" size={24} />
                </div>
                <span className="text-3xl font-bold text-white">{stats.dueThisWeek}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">This Week</h3>
              <p className="text-xs text-gray-400">Due in 7 days</p>
            </div>
          </Card>
        </div>
      )}

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search work by title, project, type..."
            onSearch={setSearchQuery}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
          >
            <List size={16} className="mr-1" />
            List
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 size={16} className="mr-1" />
            Grid
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExport}>
            <Download size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card hover={false}>
        <div className="p-4 flex flex-wrap items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            options={[
              { value: 'all', label: 'All Items' },
              { value: 'task', label: 'Tasks Only' },
              { value: 'content', label: 'Content Only' },
            ]}
            className="w-40"
          />

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'due-today', label: 'Due Today' },
              { value: 'this-week', label: 'This Week' },
            ]}
            className="w-40"
          />

          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
            className="w-40"
          />

          <div className="flex-1" />
          
          <div className="text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filteredWork.length}</span> of {myWork.length} items
          </div>
        </div>
      </Card>

      {/* Work Items */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-[#563EB7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredWork.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#563EB7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-[#563EB7]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {filterStatus === 'completed' ? 'No completed items' : 'No work items'}
            </h3>
            <p className="text-gray-400">
              {filterStatus === 'active' 
                ? "Great job! You're all caught up 🎉" 
                : filterStatus === 'completed'
                ? 'Complete some tasks to see them here'
                : myWork.length === 0
                ? 'No work assigned to you yet'
                : 'No items match your filters'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="divide-y divide-[#563EB7]/10">
            {filteredWork.map((item, index) => {
              const overdueStatus = isOverdue(item);
              
              return (
                <div 
                  key={`${item.type}-${item.id}`}
                  className="p-6 hover:bg-[#1a1333]/50 transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className="w-12 h-12 bg-[#1a1333] rounded-xl flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(item)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1 flex items-center gap-2 flex-wrap">
                            {item.title}
                            {overdueStatus && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle size={12} />
                                Overdue
                              </span>
                            )}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-400 line-clamp-2 mb-2">{item.description}</p>
                          )}
                          {item.projectName && (
                            <Link 
                              href={`/projects/${item.projectId}`}
                              className="text-xs text-gray-500 hover:text-[#563EB7] transition-colors flex items-center gap-1 w-fit"
                            >
                              <Target size={12} />
                              {item.projectName}
                            </Link>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getStatusBadge(item)} size="sm">
                            {String(item.status).replace('-', ' ')}
                          </Badge>
                          <Badge variant={getPriorityBadge(item.priority)} size="sm">
                            {item.priority}
                          </Badge>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>Due: {formatDate(item.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span className={overdueStatus ? 'text-red-400 font-medium' : ''}>
                            {getRelativeTime(item.dueDate)}
                          </span>
                        </div>
                        <div className="text-gray-500 capitalize">
                          {item.type === 'task' ? item.taskType?.replace('-', ' ') : item.contentType}
                          {item.isReel && ' (Reel)'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <ProgressBar progress={item.progress} size="sm" showLabel />
                      </div>

                      {/* Action Button */}
                      {item.projectId && (
                        <div className="flex justify-end">
                          <Link href={`/projects/${item.projectId}`}>
                            <Button size="sm" variant="ghost">
                              View Project
                              <ChevronRight size={14} className="ml-1" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredWork.map((item, index) => {
              const overdueStatus = isOverdue(item);
              
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="p-5 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/20 hover:border-[#563EB7]/40 hover:shadow-xl hover:shadow-[#563EB7]/10 transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {getTypeIcon(item)}
                    <Badge variant={getPriorityBadge(item.priority)} size="sm">
                      {item.priority}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  
                  {item.projectName && (
                    <p className="text-xs text-gray-500 mb-3">{item.projectName}</p>
                  )}
                  
                  <div className="space-y-2 mb-3">
                    <Badge variant={getStatusBadge(item)} size="sm">
                      {String(item.status).replace('-', ' ')}
                    </Badge>
                    
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(item.dueDate)}
                    </div>
                    
                    {overdueStatus && (
                      <div className="text-xs text-red-400 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Overdue
                      </div>
                    )}
                  </div>
                  
                  <ProgressBar progress={item.progress} size="sm" showLabel />
                  
                  {item.projectId && (
                    <Link href={`/projects/${item.projectId}`} className="mt-3 block">
                      <Button size="sm" variant="ghost" className="w-full">
                        View Project
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

