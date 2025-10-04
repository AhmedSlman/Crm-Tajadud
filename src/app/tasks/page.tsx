'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import Select from '@/components/Select';
import SearchBar from '@/components/SearchBar';
import KanbanBoard from '@/components/KanbanBoard';
import EmptyState from '@/components/EmptyState';
import { Plus, Pencil, Trash2, Calendar, User, Filter, List, LayoutGrid, Download, CheckSquare } from 'lucide-react';
import { Task } from '@/types';
import { exportToCSV, searchInObject } from '@/lib/utils';

export default function TasksPage() {
  const { tasks, projects, users, addTask, updateTask, deleteTask, currentUser } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
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
        createdBy: currentUser?.id || '1',
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

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      
      // Priority filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      
      // Project filter
      if (filterProject !== 'all' && task.projectId !== filterProject) return false;
      
      // Search filter
      if (searchQuery && !searchInObject(task, searchQuery)) return false;
      
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterProject, searchQuery]);

  const handleExport = () => {
    const exportData = filteredTasks.map(task => {
      const assignee = users.find(u => u.id === task.assignedTo);
      const creator = users.find(u => u.id === task.createdBy);
      const project = projects.find(p => p.id === task.projectId);
      
      return {
        Title: task.title,
        Description: task.description,
        Type: task.type,
        Status: task.status,
        Priority: task.priority,
        'Assigned To': assignee?.name || '',
        'Created By': creator?.name || '',
        Project: project?.name || '',
        'Start Date': task.startDate,
        'Due Date': task.dueDate,
        'Progress': `${task.progress}%`,
      };
    });
    
    exportToCSV(exportData, 'tasks');
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const selectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id)));
    }
  };

  const bulkDelete = () => {
    if (confirm(`Delete ${selectedTasks.size} tasks?`)) {
      selectedTasks.forEach(id => deleteTask(id));
      setSelectedTasks(new Set());
    }
  };

  const bulkStatusChange = (status: Task['status']) => {
    selectedTasks.forEach(id => updateTask(id, { status }));
    setSelectedTasks(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Tasks
          </h1>
          <p className="text-gray-400 text-lg">Track and manage all tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download size={20} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search tasks by title, description, type..."
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
            variant={viewMode === 'board' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('board')}
          >
            <LayoutGrid size={16} className="mr-1" />
            Board
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card hover={false}>
        <div className="p-4 flex flex-wrap items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'to-do', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'review', label: 'Review' },
              { value: 'done', label: 'Done' },
              { value: 'delayed', label: 'Delayed' },
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

          <Select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            options={[
              { value: 'all', label: 'All Projects' },
              ...projects.filter(p => p && p.id).map(p => ({ value: p.id, label: p.name }))
            ]}
            className="w-48"
          />

          <div className="flex-1" />
          
          <div className="text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filteredTasks.length}</span> of {tasks.length} tasks
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTasks.size > 0 && (
        <Card hover={false}>
          <div className="p-4 flex items-center justify-between bg-gradient-to-r from-[#563EB7]/10 to-transparent">
            <div className="flex items-center gap-3">
              <CheckSquare className="text-[#563EB7]" size={20} />
              <span className="text-white font-semibold">{selectedTasks.size} tasks selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    bulkStatusChange(e.target.value as Task['status']);
                  }
                }}
                options={[
                  { value: '', label: 'Change Status' },
                  { value: 'to-do', label: 'To Do' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'review', label: 'Review' },
                  { value: 'done', label: 'Done' },
                ]}
                className="w-40"
              />
              <Button size="sm" variant="danger" onClick={bulkDelete}>
                <Trash2 size={16} className="mr-1" />
                Delete Selected
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedTasks(new Set())}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content */}
      {viewMode === 'board' ? (
        <KanbanBoard
          tasks={filteredTasks}
          users={users}
          onTaskClick={(task) => handleOpenModal(task)}
          onStatusChange={(taskId, status) => updateTask(taskId, { status })}
        />
      ) : (
        <Card>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={<CheckSquare size={48} className="text-[#563EB7]" />}
              title="No tasks found"
              description="Create your first task to get started or adjust your filters"
              actionLabel="Create Task"
              onAction={() => handleOpenModal()}
            />
          ) : (
            <Table headers={[
              <input
                key="checkbox"
                type="checkbox"
                checked={selectedTasks.size === filteredTasks.length}
                onChange={selectAll}
                className="w-4 h-4 rounded border-[#563EB7]/30 bg-[#1a1333] checked:bg-[#563EB7] focus:ring-[#563EB7] focus:ring-2"
              />,
              'Task',
              'Type',
              'Priority',
              'Status',
              'Assigned To',
              'Due Date',
              'Progress',
              'Actions'
            ]}>
              {filteredTasks.filter(task => task && task.id).map((task) => {
                const assignee = users.find(u => u.id === task.assignedTo);
                const project = projects.find(p => p.id === task.projectId);
                const isSelected = selectedTasks.has(task.id);
                
                return (
                  <TableRow key={task.id} className={isSelected ? 'bg-[#563EB7]/10' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTaskSelection(task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-[#563EB7]/30 bg-[#1a1333] checked:bg-[#563EB7] focus:ring-[#563EB7] focus:ring-2"
                      />
                    </TableCell>
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
      )}

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
              options={[{ value: '', label: 'No Project' }, ...projects.filter(p => p && p.id).map(p => ({ value: p.id, label: p.name }))]}
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
              options={users.filter(u => u && u.id).map(u => ({ value: u.id, label: u.name }))}
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

