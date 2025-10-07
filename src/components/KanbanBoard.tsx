'use client';

import { Task, TaskStatus } from '@/types';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import { Clock, User as UserIcon, Calendar } from 'lucide-react';

type KanbanBoardProps = {
  tasks: Task[];
  users: { id: string; name: string }[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
};

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'to-do', label: 'To Do', color: 'from-gray-500/20 to-slate-500/20' },
  { status: 'in-progress', label: 'In Progress', color: 'from-blue-500/20 to-cyan-500/20' },
  { status: 'review', label: 'Review', color: 'from-yellow-500/20 to-orange-500/20' },
  { status: 'done', label: 'Done', color: 'from-green-500/20 to-emerald-500/20' },
  { status: 'delayed', label: 'Delayed', color: 'from-red-500/20 to-rose-500/20' },
];

export default function KanbanBoard({ tasks, users, onTaskClick, onStatusChange }: KanbanBoardProps) {
  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
      'urgent': 'danger',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return priorityMap[priority] || 'default';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.status);
        
        return (
          <div key={column.status} className="flex flex-col min-w-[280px]">
            {/* Column Header */}
            <div className={`p-4 bg-gradient-to-br ${column.color} rounded-xl border border-[#563EB7]/20 mb-3`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">{column.label}</h3>
                <span className="px-2.5 py-1 bg-[#14102a] text-[#563EB7] text-xs font-bold rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex-1 space-y-3 min-h-[400px]">
              {columnTasks.map((task, index) => {
                const assignee = users.find(u => String(u.id) === String(task.assignedTo));
                
                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="group p-4 bg-gradient-to-br from-[#14102a] to-[#1a1333] rounded-xl border border-[#563EB7]/20 hover:border-[#563EB7]/40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#563EB7]/10 hover:-translate-y-1 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Priority Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={getPriorityBadge(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h4 className="font-bold text-white mb-2 group-hover:text-[#a78bfa] transition-colors line-clamp-2">
                      {task.title}
                    </h4>

                    {/* Task Type */}
                    <p className="text-xs text-gray-400 mb-3 capitalize">
                      {task.type.replace('-', ' ')}
                    </p>

                    {/* Progress */}
                    {task.progress > 0 && (
                      <ProgressBar progress={task.progress} size="sm" className="mb-3" />
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#563EB7]/10">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={12} />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      {assignee && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <UserIcon size={12} />
                          <span className="truncate max-w-[80px]">{assignee.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Comments indicator */}
                    {task.comments && task.comments.length > 0 && (
                      <div className="mt-2 text-xs text-[#563EB7] flex items-center gap-1">
                        💬 {task.comments.length} {task.comments.length === 1 ? 'comment' : 'comments'}
                      </div>
                    )}
                  </div>
                );
              })}

              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm border-2 border-dashed border-[#563EB7]/10 rounded-xl">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

