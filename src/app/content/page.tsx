'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Plus, Pencil, Trash2, FileText, Calendar, User, Filter } from 'lucide-react';
import { Content } from '@/types';

export default function ContentPage() {
  const { content, projects, campaigns, users, activeUsers, addContent, updateContent, deleteContent, currentUser, canPerformAction } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'post' as Content['contentType'],
    projectId: '',
    campaignId: '',
    status: 'idea' as Content['status'],
    assignedTo: '',
    startDate: '',
    dueDate: '',
    publishDate: '',
    priority: 'medium' as Content['priority'],
    progress: 0,
  });

  const handleOpenModal = (contentItem?: Content) => {
    if (contentItem) {
      setEditingContent(contentItem);
      setFormData({
        title: contentItem.title,
        contentType: contentItem.contentType,
        projectId: contentItem.projectId || '',
        campaignId: contentItem.campaignId || '',
        status: contentItem.status,
        assignedTo: contentItem.assignedTo,
        startDate: contentItem.startDate,
        dueDate: contentItem.dueDate,
        publishDate: contentItem.publishDate || '',
        priority: contentItem.priority,
        progress: contentItem.progress,
      });
    } else {
      setEditingContent(null);
      setFormData({
        title: '',
        contentType: 'post',
        projectId: '',
        campaignId: '',
        status: 'idea',
        assignedTo: users[0]?.id || '',
        startDate: '',
        dueDate: '',
        publishDate: '',
        priority: 'medium',
        progress: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingContent) {
      updateContent(editingContent.id, formData);
    } else {
      const newContent: Content = {
        id: Date.now().toString(),
        ...formData,
        createdBy: '1',
        attachments: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      addContent(newContent);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteContent(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'published': 'success',
      'approved': 'success',
      'scheduled': 'info',
      'in-progress': 'info',
      'review': 'warning',
      'idea': 'default',
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

  const filteredContent = filterStatus === 'all' ? content : content.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Planning</h1>
          <p className="text-gray-400">Plan and manage your content</p>
        </div>
        {canPerformAction(currentUser?.role, 'content', 'create') && (
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            New Content
          </Button>
        )}
      </div>

      <Card>
        <div className="p-4 border-b border-[#563EB7]/20 flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Content' },
              { value: 'idea', label: 'Ideas' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'review', label: 'Review' },
              { value: 'approved', label: 'Approved' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'published', label: 'Published' },
            ]}
            className="w-48"
          />
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No content found</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Create Your First Content
            </Button>
          </div>
        ) : (
          <Table headers={['Title', 'Type', 'Status', 'Priority', 'Assigned To', 'Due Date', 'Progress', 'Actions']}>
            {filteredContent.filter(contentItem => contentItem && contentItem.id).map((contentItem) => {
              const assignee = users.find(u => u.id === contentItem.assignedTo);
              const project = projects.find(p => p.id === contentItem.projectId);
              
              return (
                <TableRow key={contentItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-white">{contentItem.title}</div>
                      {project && <div className="text-xs text-gray-400 mt-1">{project.name}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-gray-300 capitalize">{contentItem.contentType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(contentItem.status)} size="sm">
                      {contentItem.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadge(contentItem.priority)} size="sm">
                      {contentItem.priority}
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
                      <span className="text-white">{new Date(contentItem.dueDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <ProgressBar progress={contentItem.progress} size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canPerformAction(currentUser?.role, 'content', 'update') && (
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(contentItem)}>
                          <Pencil size={14} />
                        </Button>
                      )}
                      {canPerformAction(currentUser?.role, 'content', 'delete') && (
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(contentItem.id)}>
                          <Trash2 size={14} className="text-red-400" />
                        </Button>
                      )}
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
        title={editingContent ? 'Edit Content' : 'New Content'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingContent ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Content Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter content title"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Content Type"
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value as Content['contentType'] })}
              options={[
                { value: 'post', label: 'Post' },
                { value: 'video', label: 'Video' },
                { value: 'article', label: 'Article' },
                { value: 'graphic', label: 'Graphic' },
                { value: 'email', label: 'Email' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Content['status'] })}
              options={[
                { value: 'idea', label: 'Idea' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'review', label: 'Review' },
                { value: 'approved', label: 'Approved' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'published', label: 'Published' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Project (Optional)"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              options={[{ value: '', label: 'No Project' }, ...projects.map(p => ({ value: p.id, label: p.name }))]}
            />
            <Select
              label="Campaign (Optional)"
              value={formData.campaignId}
              onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
              options={[{ value: '', label: 'No Campaign' }, ...campaigns.map(c => ({ value: c.id, label: c.name }))]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Content['priority'] })}
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
              options={activeUsers.map(u => ({ value: u.id, label: u.name }))}
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
              label="Publish Date (Optional)"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
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

