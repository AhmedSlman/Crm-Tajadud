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
import { Plus, Pencil, Trash2, Calendar, User } from 'lucide-react';
import { Project } from '@/types';

export default function ProjectsPage() {
  const { projects, clients, users, addProject, updateProject, deleteProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    startDate: '',
    endDate: '',
    status: 'planned' as Project['status'],
    projectManager: '',
    progress: 0,
  });

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        clientId: project.clientId,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        projectManager: project.projectManager,
        progress: project.progress,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        clientId: clients[0]?.id || '',
        startDate: '',
        endDate: '',
        status: 'planned',
        projectManager: users[0]?.id || '',
        progress: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        createdBy: '1',
        linkedTasks: [],
        linkedCampaigns: [],
        linkedContent: [],
        files: [],
        createdAt: new Date().toISOString(),
      };
      addProject(newProject);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'completed': 'success',
      'in-progress': 'info',
      'planned': 'default',
      'on-hold': 'warning',
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage all your client projects</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const client = clients.find(c => c.id === project.clientId);
          const manager = users.find(u => u.id === project.projectManager);
          
          return (
            <Card key={project.id}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400">{client?.name}</p>
                  </div>
                  <Badge variant={getStatusBadge(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{project.description}</p>

                <ProgressBar progress={project.progress} showLabel size="md" className="mb-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <User size={16} className="mr-2" />
                    <span>{manager?.name}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#563EB7]/20 flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleOpenModal(project)} className="flex-1">
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                    <Trash2 size={14} className="text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {projects.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects yet</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Create Your First Project
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'New Project'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Project description..."
            rows={3}
          />
          <Select
            label="Client"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            options={clients.map(c => ({ value: c.id, label: c.name }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              options={[
                { value: 'planned', label: 'Planned' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'on-hold', label: 'On Hold' },
              ]}
            />
            <Select
              label="Project Manager"
              value={formData.projectManager}
              onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
              options={users.filter(u => u.role !== 'client').map(u => ({ value: u.id, label: u.name }))}
            />
          </div>
          <Input
            label="Progress (%)"
            type="number"
            min="0"
            max="100"
            value={formData.progress.toString()}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
          />
        </div>
      </Modal>
    </div>
  );
}

