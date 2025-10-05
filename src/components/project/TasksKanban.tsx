'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Task, TaskStatus } from '@/types';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import Select from '@/components/Select';
import { Plus, User, Calendar, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TasksKanbanProps = {
  tasks: Task[];
  projectId: string;
  month: string;
  onRefresh?: () => void;
};

type Column = {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
};

const columns: Column[] = [
  { id: 'to-do', title: 'To Do', color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
  { id: 'in-progress', title: 'In Progress', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { id: 'review', title: 'Review', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  { id: 'done', title: 'Done', color: 'text-green-400', bgColor: 'bg-green-500/10' },
];

function DroppableColumn({ 
  column, 
  tasks,
  onEdit,
  onDelete
}: { 
  column: Column; 
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gradient-to-br from-[#14102a] to-[#0c081e] border border-[#563EB7]/20 rounded-xl p-4 min-h-[500px]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.bgColor.replace('/10', '')}`} />
          <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
        </div>
        <span className={`text-sm font-bold px-2 py-0.5 rounded ${column.bgColor} ${column.color}`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function TaskCard({ 
  task, 
  onEdit, 
  onDelete 
}: { 
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}) {
  const { users } = useData();
  const assignee = users.find(u => u.id === task.assignedTo);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'text-red-400 bg-red-500/20',
      high: 'text-orange-400 bg-orange-500/20',
      medium: 'text-blue-400 bg-blue-500/20',
      low: 'text-gray-400 bg-gray-500/20',
    };
    return colors[priority] || colors.low;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gradient-to-br from-[#1a1333] to-[#14102a] border border-[#563EB7]/20 rounded-lg p-4 mb-3 hover:border-[#563EB7]/40 transition-all cursor-move group"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-500 hover:text-gray-300 mt-1 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-semibold text-sm group-hover:text-[#a78bfa] transition-colors flex-1">
              {task.title}
            </h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 hover:bg-[#563EB7]/20 rounded text-gray-400 hover:text-white"
                >
                  <Pencil size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-xs px-2 py-0.5 rounded capitalize bg-[#563EB7]/20 text-[#563EB7]">
              {task.type.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{assignee?.name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksKanban({ tasks: allTasks, projectId, month, onRefresh }: TasksKanbanProps) {
  const { users, addTask, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Local state for optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>(allTasks);
  
  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(allTasks);
  }, [allTasks]);
  
  // Get today's date and tomorrow in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general' as Task['type'],
    priority: 'medium' as Task['priority'],
    assignedTo: users[0]?.id || '',
    startDate: today,
    dueDate: tomorrowStr,
  });

  // Filter tasks by month (optional filtering - show all if no month filter needed)
  const tasks = month 
    ? localTasks.filter(t => {
        const taskMonth = t.dueDate?.substring(0, 7);
        return taskMonth === month;
      })
    : localTasks;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = localTasks.find(t => String(t.id) === String(taskId));

    // Skip if dropped in same column
    if (task?.status === newStatus) return;

    // Optimistic update - update UI immediately
    const updatedTasks = localTasks.map(t => 
      String(t.id) === String(taskId) 
        ? { ...t, status: newStatus }
        : t
    );
    setLocalTasks(updatedTasks);

    const statusLabels: Record<TaskStatus, string> = {
      'to-do': 'To Do',
      'in-progress': 'In Progress',
      'review': 'Review',
      'done': 'Done',
      'delayed': 'Delayed',
    };
    
    toast.success(`Task moved! ✅`, {
      description: `${task?.title} → ${statusLabels[newStatus]}`,
    });

    // Update in backend (in background)
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      // Revert on error
      setLocalTasks(allTasks);
      toast.error('Failed to update task status');
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        assignedTo: task.assignedTo,
        startDate: task.startDate,
        dueDate: task.dueDate,
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        type: 'general',
        priority: 'medium',
        assignedTo: users[0]?.id || '',
        startDate: today,
        dueDate: tomorrowStr,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmitTask = async () => {
    if (!formData.title || !formData.dueDate) {
      toast.error('Please fill task title and due date');
      return;
    }

    // Validate dates
    if (formData.dueDate <= formData.startDate) {
      toast.error('Due date must be after start date');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        toast.success(`Task updated! ✅`);
      } else {
        await addTask({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          status: 'to-do',
          priority: formData.priority,
          assignedTo: formData.assignedTo,
          createdBy: '1',
          startDate: formData.startDate,
          dueDate: formData.dueDate,
          progress: 0,
          projectId: String(projectId),
        });

        const assignee = users.find(u => u.id === formData.assignedTo);
        toast.success(`Task created! 🎉`, {
          description: `Assigned to ${assignee?.name}`,
        });
      }

      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        type: 'general',
        priority: 'medium',
        assignedTo: users[0]?.id || '',
        startDate: today,
        dueDate: tomorrowStr,
      });
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`, {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (confirm(`Are you sure you want to delete "${task?.title}"?`)) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted! 🗑️');
        
        // Refresh project data
        if (onRefresh) onRefresh();
      } catch (error) {
        // Only show error on real errors (404 won't throw)
        toast.error('Failed to delete task');
      }
    }
  };

  const activeTask = localTasks.find(t => String(t.id) === String(activeId));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Tasks Board</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            return (
              <DroppableColumn 
                key={column.id} 
                column={column} 
                tasks={columnTasks}
                onEdit={handleOpenModal}
                onDelete={handleDeleteTask}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard 
              task={activeTask}
              onEdit={handleOpenModal}
              onDelete={handleDeleteTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitTask}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingTask ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingTask ? 'Update Task' : 'Create Task'
              )}
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
            required
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              min={formData.startDate}
              required
            />
          </div>

          <Select
            label="Assign To"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            options={users.filter(u => u.role !== 'admin').map(u => ({ 
              value: u.id, 
              label: u.name 
            }))}
          />
        </div>
      </Modal>
    </div>
  );
}

