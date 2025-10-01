'use client';

import { useState } from 'react';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import Button from './Button';
import Modal from './Modal';
import Input, { Textarea } from './Input';
import Select from './Select';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Task, Priority, TaskStatus, TaskType } from '@/types';

type ContentPlanTableProps = {
  tasks: Task[];
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
  onTaskAdd: (task: Task) => void;
  users: { id: string; name: string; role: string }[];
  clients: { id: string; name: string; linkedProjects: string[] }[];
};

export default function ContentPlanTable({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskAdd,
  users,
  clients 
}: ContentPlanTableProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityBadge = (priority: Priority) => {
    const map: Record<Priority, 'danger' | 'warning' | 'info' | 'default'> = {
      'urgent': 'danger',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return map[priority];
  };

  const getStatusBadge = (status: TaskStatus) => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'done': 'success',
      'in-progress': 'info',
      'review': 'warning',
      'to-do': 'default',
      'delayed': 'danger',
    };
    return map[status] || 'default';
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingTask) {
      onTaskUpdate(editingTask.id, editingTask);
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Content Plan & Tasks</h3>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-1" />
          Add Task
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#563EB7]/20">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#563EB7]/20 to-[#7c5fdc]/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Num</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Task</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Task Owner</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">O-Job Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Member</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">M-Job Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Client Sheet</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Notes</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">End Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Done</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#563EB7]/10">
            {tasks.map((task, index) => {
              const owner = users.find(u => u.id === task.createdBy);
              const member = users.find(u => u.id === task.assignedTo);
              const client = task.projectId ? clients.find(c => c.linkedProjects.includes(task.projectId!)) : null;
              
              return (
                <tr key={task.id} className="bg-gradient-to-br from-[#14102a] to-[#1a1333] hover:from-[#1a1333] hover:to-[#241a47] transition-all duration-300">
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{String(index + 1).padStart(3, '0')}</td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="text-sm font-semibold text-white truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-400 truncate mt-1">{task.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getPriorityBadge(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{owner?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 capitalize">{owner?.role.replace('-', ' ') || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{member?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 capitalize">{member?.role.replace('-', ' ') || 'N/A'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 capitalize">{task.type.replace('-', ' ')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#563EB7] rounded-full" />
                      <span className="text-xs text-white font-medium">{client?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      {task.comments.length > 0 ? (
                        <p className="text-xs text-gray-400 truncate" title={task.comments[0].text}>
                          {task.comments[0].text}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-500">No notes</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">{new Date(task.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadge(task.status)} size="sm">
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">
                    {task.completionDate ? new Date(task.completionDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="w-24">
                      <ProgressBar progress={task.progress} size="sm" />
                      <span className="text-xs text-gray-400 mt-1 block">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1.5 text-[#563EB7] hover:text-white hover:bg-[#563EB7] rounded-lg transition-all duration-300"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onTaskDelete(task.id)}
                        className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingTask && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          title="Edit Task"
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Task Title"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
              />
              <Select
                label="Status"
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                options={[
                  { value: 'to-do', label: 'To Do' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'review', label: 'Review' },
                  { value: 'done', label: 'Done' },
                  { value: 'delayed', label: 'Delayed' },
                ]}
              />
            </div>
            <Input
              label="Progress (%)"
              type="number"
              min="0"
              max="100"
              value={editingTask.progress.toString()}
              onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) || 0 })}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

