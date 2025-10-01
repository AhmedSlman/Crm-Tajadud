'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Task, TaskStatus } from '@/types';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import Select from '@/components/Select';
import { Plus, User, Calendar, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
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

function TaskCard({ task }: { task: Task }) {
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
          <h4 className="text-white font-semibold text-sm mb-2 group-hover:text-[#a78bfa] transition-colors">
            {task.title}
          </h4>
          
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

export default function TasksKanban({ tasks, projectId }: TasksKanbanProps) {
  const { users, addTask, updateTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'general' as Task['type'],
    priority: 'medium' as Task['priority'],
    assignedTo: users[0]?.id || '',
    dueDate: '',
  });

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Update task status
    updateTask(taskId, { status: newStatus });

    setActiveId(null);
  };

  const handleAddTask = () => {
    if (!formData.title || !formData.dueDate) return;

    addTask({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: 'to-do',
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      createdBy: '1',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      progress: 0,
      projectId,
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      type: 'general',
      priority: 'medium',
      assignedTo: users[0]?.id || '',
      dueDate: '',
    });
  };

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Tasks Board</h2>
        <Button onClick={() => setIsModalOpen(true)}>
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
              <SortableContext
                key={column.id}
                id={column.id}
                items={columnTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bg-gradient-to-br from-[#14102a] to-[#0c081e] border border-[#563EB7]/20 rounded-xl p-4 min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${column.bgColor.replace('/10', '')}`} />
                      <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
                    </div>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${column.bgColor} ${column.color}`}>
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div>
                    {columnTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Create Task
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
            <Select
              label="Assign To"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              options={users.filter(u => u.role !== 'admin').map(u => ({ 
                value: u.id, 
                label: u.name 
              }))}
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

