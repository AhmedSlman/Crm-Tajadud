'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import Select from '@/components/Select';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import LoadingState, { LoadingSpinner } from '@/components/LoadingState';
import { Plus, Pencil, Trash2, Calendar, User, Download, FolderKanban, TrendingUp } from 'lucide-react';
import { Project } from '@/types';
import { exportToCSV, searchInObject } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const { projects, clients, users, activeUsers, addProject, updateProject, deleteProject, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.clientId) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        toast.success(`${formData.name} updated successfully! ✅`);
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
        await addProject(newProject);
        toast.success(`${formData.name} created successfully! 🎉`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save project', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete ${project?.name}?`)) {
      try {
        deleteProject(id);
        toast.success(`${project?.name} deleted successfully! 🗑️`);
      } catch (error) {
        toast.error('Failed to delete project');
      }
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

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (filterStatus !== 'all' && project.status !== filterStatus) return false;
      if (filterClient !== 'all' && project.clientId !== filterClient) return false;
      if (searchQuery && !searchInObject(project, searchQuery)) return false;
      return true;
    });
  }, [projects, filterStatus, filterClient, searchQuery]);

  const handleExport = () => {
    const exportData = filteredProjects.map(project => {
      const client = clients.find(c => c.id === project.clientId);
      const manager = users.find(u => u.id === project.projectManager);
      
      return {
        Name: project.name,
        Description: project.description,
        Client: client?.name || '',
        'Project Manager': manager?.name || '',
        Status: project.status,
        'Start Date': project.startDate,
        'End Date': project.endDate,
        'Progress': `${project.progress}%`,
        'Total Tasks': project.linkedTasks?.length || 0,
        'Total Campaigns': project.linkedCampaigns?.length || 0,
      };
    });
    exportToCSV(exportData, 'projects');
    toast.success(`Exported ${exportData.length} projects! 📊`, {
      description: 'File downloaded successfully',
    });
  };

  // Show loading state
  if (loading) {
    return (
      <LoadingState 
        title="Projects"
        subtitle="Manage your projects and track progress"
        message="Loading projects..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Projects
          </h1>
          <p className="text-gray-400 text-lg">Manage all your client projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download size={20} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search projects by name, description, client..."
        onSearch={setSearchQuery}
      />

      {/* Filters & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card hover={false}>
          <div className="p-4">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'planned', label: 'Planned' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'on-hold', label: 'On Hold' }
              ]}
            />
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4">
            <Select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              options={[
                { value: 'all', label: 'All Clients' },
                ...clients.filter(c => c && c.id).map(c => ({ value: c.id, label: c.name }))
              ]}
            />
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-[#563EB7] mb-1">{filteredProjects.length}</div>
            <p className="text-xs text-gray-400">Showing</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {Math.round(filteredProjects.reduce((sum, p) => sum + p.progress, 0) / (filteredProjects.length || 1))}%
            </div>
            <p className="text-xs text-gray-400">Avg Progress</p>
          </div>
        </Card>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={48} className="text-[#563EB7]" />}
          title={searchQuery ? 'No projects found' : 'No projects yet'}
          description={searchQuery ? 'Try adjusting your search or filters' : 'Create your first project to get started'}
          actionLabel={searchQuery ? undefined : 'Create Your First Project'}
          onAction={searchQuery ? undefined : () => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
          const client = clients.find(c => c.id === project.clientId);
          const manager = users.find(u => u.id === project.projectManager);
          
          return (
            <Card key={project.id}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1 hover:text-[#a78bfa] transition-colors cursor-pointer">
                      <a href={`/projects/${project.id}`}>{project.name}</a>
                    </h3>
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
                  <Link href={`/projects/${project.id}`} className="flex-1">
                    <Button size="sm" variant="primary" className="w-full">
                      <TrendingUp size={14} className="mr-1" />
                      Open Project
                    </Button>
                  </Link>
                  <Button size="sm" variant="secondary" onClick={() => handleOpenModal(project)}>
                    <Pencil size={14} />
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
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'New Project'}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {editingProject ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingProject ? 'Update' : 'Create'
              )}
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
              options={activeUsers.map(u => ({ value: u.id, label: u.name }))}
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

