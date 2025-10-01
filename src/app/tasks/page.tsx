'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import Select from '@/components/Select';
import { Plus, Pencil, Trash2, Calendar, User, Filter } from 'lucide-react';
import { Task } from '@/types';

export default function TasksPage() {
  const { tasks, projects, users, addTask, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general' as Task['type'],
    status: 'to-do' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    projectId: '',
    startDate: '',
    dueDate: '',
    progress: 0,
  });

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        type: task.type,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        projectId: task.projectId || '',
        startDate: task.startDate,
        dueDate: task.dueDate,
        progress: task.progress,
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        type: 'general',
        status: 'to-do',
        priority: 'medium',
        assignedTo: users[0]?.id || '',
        projectId: '',
        startDate: '',
        dueDate: '',
        progress: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        createdBy: '1',
        attachments: [],
        comments: [],
        subtasks: [],
        changeLog: [],
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'done': 'success',
      'in-progress': 'info',
      'review': 'warning',
      'to-do': 'default',
      'delayed': 'danger',
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

  const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-gray-400">Track and manage all tasks</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          New Task
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-[#563EB7]/20 flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Tasks' },
              { value: 'to-do', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'review', label: 'Review' },
              { value: 'done', label: 'Done' },
              { value: 'delayed', label: 'Delayed' },
            ]}
            className="w-48"
          />
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No tasks found</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Create Your First Task
            </Button>
          </div>
        ) : (
          <Table headers={['Task', 'Type', 'Priority', 'Status', 'Assigned To', 'Due Date', 'Progress', 'Actions']}>
            {filteredTasks.map((task) => {
              const assignee = users.find(u => u.id === task.assignedTo);
              const project = projects.find(p => p.id === task.projectId);
              
              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-white">{task.title}</div>
                      {project && <div className="text-xs text-gray-400 mt-1">{project.name}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-300 capitalize">{task.type.replace('-', ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadge(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(task.status)} size="sm">
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-white">{assignee?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-white">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <ProgressBar progress={task.progress} size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenModal(task)}>
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(task.id)}>
                        <Trash2 size={14} className="text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter task title"
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Task description..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Task['type'] })}
              options={[
                { value: 'content-writing', label: 'Content Writing' },
                { value: 'graphic-design', label: 'Graphic Design' },
                { value: 'video-editing', label: 'Video Editing' },
                { value: 'ads-setup', label: 'Ads Setup' },
                { value: 'seo', label: 'SEO' },
                { value: 'reporting', label: 'Reporting' },
                { value: 'general', label: 'General' },
              ]}
            />
            <Select
              label="Project (Optional)"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              options={[{ value: '', label: 'No Project' }, ...projects.map(p => ({ value: p.id, label: p.name }))]}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              options={[
                { value: 'to-do', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'review', label: 'Review' },
                { value: 'done', label: 'Done' },
                { value: 'delayed', label: 'Delayed' },
              ]}
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Select
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              options={users.filter(u => u.role !== 'client').map(u => ({ value: u.id, label: u.name }))}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <Input
              label="Progress (%)"
              type="number"
              min="0"
              max="100"
              value={formData.progress.toString()}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

