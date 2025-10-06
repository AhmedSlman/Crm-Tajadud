'use client';

import { useState, useEffect, memo } from 'react';
import { useData } from '@/context/DataContext';
import { Content, UserRole, ColumnName } from '@/types';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Plus, Edit2, Check, X, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

type ContentPlanTableProps = {
  content: Content[];
  projectId: string;
  month: string;
  userRole: UserRole;
  onRefresh?: () => void;
};

export default function ContentPlanTable({ 
  content, 
  projectId, 
  month, 
  userRole,
  onRefresh
}: ContentPlanTableProps) {
  const { addContent, updateContent, deleteContent, users, activeUsers, canUserEdit } = useData();
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Local state for optimistic updates
  const [localContent, setLocalContent] = useState<Content[]>(content);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  
  // Update local content when props change (only for new/removed items)
  useEffect(() => {
    const filteredContent = content.filter(c => !deletedIds.has(String(c.id)));
    
    // Check if items were added or removed
    const localIds = new Set(localContent.map(c => String(c.id)));
    const newIds = new Set(filteredContent.map(c => String(c.id)));
    
    const hasNewItems = filteredContent.some(c => !localIds.has(String(c.id)));
    const hasRemovedItems = localContent.some(c => !newIds.has(String(c.id)));
    
    if (hasNewItems || hasRemovedItems) {
      // Only sync when items are added/removed, preserve local updates
      setLocalContent(filteredContent.map(item => {
        const localItem = localContent.find(l => String(l.id) === String(item.id));
        return localItem || item;
      }));
    }
    // Don't update if only data changed (preserve optimistic updates)
  }, [content, deletedIds]);
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'post' as Content['contentType'],
    status: 'idea' as Content['status'],
    assignedTo: activeUsers[0]?.id || users[0]?.id || '',
    startDate: today,
    dueDate: tomorrowStr,
    priority: 'medium' as Content['priority'],
    designBrief: '',
    inspiration: '',
    design: '',
    textContent: '',
    driveLink: '',
    notes: '',
  });

  const handleEditStart = (contentId: string, field: string, currentValue: string) => {
    setEditingCell({ id: contentId, field });
    setEditValue(currentValue ?? '');
  };

  const handleEditSave = async () => {
    if (!editingCell) return;

    // Map field names from kebab-case to camelCase
    const fieldMap: Record<string, keyof Content> = {
      'design-brief': 'designBrief',
      'inspiration': 'inspiration',
      'design': 'design',
      'text-content': 'textContent',
      'drive-link': 'driveLink',
      'notes': 'notes',
    };
 
    const actualFieldName = fieldMap[editingCell.field] || editingCell.field;
    
    const updates: Partial<Content> = {
      [actualFieldName]: editValue,
    };

    // Optimistic update
    const updatedContent = localContent.map(c =>
      String(c.id) === String(editingCell.id) ? { ...c, ...updates } : c
    );
    setLocalContent(updatedContent);
    setEditingCell(null);
    setEditValue('');
    toast.success('Content updated! ✅', {
      description: `${editingCell.field.replace('-', ' ')} has been saved`,
    });

    // Update in backend
    try {
      await updateContent(editingCell.id, updates);
    } catch (error) {
      // Revert the optimistic update
      setLocalContent(localContent.map(c =>
        c.id === editingCell.id ? { ...c, [actualFieldName]: content.find(item => item.id === editingCell.id)?.[actualFieldName] } : c
      ));
      toast.error('Failed to update content');
    }
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      contentType: 'post',
      status: 'idea',
      assignedTo: activeUsers[0]?.id || users[0]?.id || '',
      startDate: today,
      dueDate: tomorrowStr,
      priority: 'medium',
      designBrief: '',
      inspiration: '',
      design: '',
      textContent: '',
      driveLink: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = async () => {
    if (!formData.title) {
      toast.error('Please enter content title');
      return;
    }

    if (formData.dueDate <= formData.startDate) {
      toast.error('Due date must be after start date');
      return;
    }

    setSubmitting(true);
    try {
      await addContent({
        title: formData.title,
        contentType: formData.contentType,
        status: formData.status,
        projectId: String(projectId),
        assignedTo: formData.assignedTo,
        createdBy: '1',
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        priority: formData.priority,
        progress: 0,
        month,
        isReel: false,
        readyForCalendar: false,
        designBrief: formData.designBrief,
        inspiration: formData.inspiration,
        design: formData.design,
        textContent: formData.textContent,
        driveLink: formData.driveLink,
        notes: formData.notes,
      });
      
      toast.success('Content added! 🎉');
      setIsAddModalOpen(false);
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to add content', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkReady = async (contentId: string) => {
    const item = localContent.find(c => c.id === contentId);
    
    // Optimistic update
    const updatedContent = localContent.map(c =>
      c.id === contentId ? { ...c, readyForCalendar: true, status: 'approved' as Content['status'] } : c
    );
    setLocalContent(updatedContent);
    toast.success(`${item?.title} is ready for calendar! 📅`, {
      description: 'You can now drag it to the social calendar',
    });

    // Update in backend
    try {
      await updateContent(contentId, { readyForCalendar: true, status: 'approved' });
    } catch (error) {
      // Revert
      setLocalContent(localContent.map(c =>
        c.id === contentId ? { ...c, readyForCalendar: false, status: item?.status || 'idea' as Content['status'] } : c
      ));
      toast.error('Failed to mark content as ready');
    }
  };

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    const oldStatus = localContent.find(c => c.id === contentId)?.status;
    const oldReady = localContent.find(c => c.id === contentId)?.readyForCalendar;
    
    // If status is changed to something other than approved/scheduled/published, clear readyForCalendar
    const validReadyStatuses = ['approved', 'scheduled', 'published'];
    const shouldClearReady = !validReadyStatuses.includes(newStatus);
    
    // Optimistic update
    const updatedContent = localContent.map(c =>
      c.id === contentId ? { 
        ...c, 
        status: newStatus as Content['status'],
        readyForCalendar: shouldClearReady ? false : c.readyForCalendar
      } : c
    );
    setLocalContent(updatedContent);
    toast.success('Status updated!');

    // Update in backend
    try {
      const updates: { status: Content['status']; readyForCalendar?: boolean } = { status: newStatus as Content['status'] };
      if (shouldClearReady) {
        updates.readyForCalendar = false;
      }
      await updateContent(contentId, updates);
    } catch (error) {
      // Revert to old status and ready state
      setLocalContent(localContent.map(c =>
        c.id === contentId ? { 
          ...c, 
          status: oldStatus as Content['status'],
          readyForCalendar: oldReady || false
        } : c
      ));
      toast.error('Failed to update status');
    }
  };

  const handleEditContent = (contentItem: Content) => {
    setEditingContent(contentItem);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingContent) return;

    try {
      await updateContent(editingContent.id, {
        title: editingContent.title,
        dueDate: editingContent.dueDate,
        assignedTo: editingContent.assignedTo,
        priority: editingContent.priority,
      });
      toast.success('Content updated! ✅');
      setIsEditModalOpen(false);
      setEditingContent(null);
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    const item = localContent.find(c => c.id === contentId);
    
    // Mark as deleted immediately
    setDeletedIds(prev => new Set(prev).add(String(contentId)));
    toast.success(`${item?.title} deleted! 🗑️`);
    setDeleteConfirmId(null);

    // Delete in backend (404 errors are handled silently by API)
    try {
      await deleteContent(contentId);
    } catch (error) {
      // Only revert on real errors (404 won't throw)
      setDeletedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(String(contentId));
        return newSet;
      });
      toast.error('Failed to delete content');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; label: string }> = {
      'idea': { variant: 'default', label: 'Idea' },
      'in-progress': { variant: 'info', label: 'In Progress' },
      'review': { variant: 'warning', label: 'Review' },
      'approved': { variant: 'success', label: 'Approved' },
      'scheduled': { variant: 'info', label: 'Scheduled' },
      'published': { variant: 'success', label: 'Published' },
    };
    return statusMap[status] || statusMap.idea;
  };

  // Editable cell component
  const EditableCell = ({ 
    contentId,
    field
  }: { 
    contentId: string;
    field: string;
  }) => {
    // Get current value from localContent for reactivity
    const contentItem = localContent.find(c => String(c.id) === String(contentId));
    if (!contentItem) return null;
    
    // Map field to actual property
    const fieldMap: Record<string, keyof Content> = {
      'design-brief': 'designBrief',
      'inspiration': 'inspiration',
      'design': 'design',
      'text-content': 'textContent',
      'drive-link': 'driveLink',
      'notes': 'notes',
    };
    const actualField = fieldMap[field] || field;
    const value = (contentItem[actualField as keyof Content] as string) || '';
    
    // Admin always has edit access
    const canEdit = userRole === 'admin' || canUserEdit(userRole, field as ColumnName);
    const isEditing = editingCell?.id === String(contentId) && editingCell?.field === field;

    if (!canEdit) {
      return (
        <td className="px-4 py-3 border-b border-[#563EB7]/10">
          <div className="text-gray-500 text-sm" title={`You don't have permission to edit ${field}`}>
            {value || '—'}
          </div>
        </td>
      );
    }

    if (isEditing) {
      return (
        <td className="px-4 py-3 border-b border-[#563EB7]/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 bg-[#1a1333] border border-[#563EB7]/30 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#563EB7]"
              autoFocus
            />
            <button
              onClick={handleEditSave}
              className="p-1 text-green-400 hover:text-green-300 transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleEditCancel}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </td>
      );
    }

    return (
      <td className="px-4 py-3 border-b border-[#563EB7]/10 group">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">{value || '—'}</span>
          <button
            onClick={() => handleEditStart(String(contentId), field, value)}
            className="opacity-0 group-hover:opacity-100 p-1 text-[#563EB7] hover:text-[#6d4dd4] transition-all"
          >
            <Edit2 size={14} />
          </button>
        </div>
      </td>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Content Plan</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your content workflow. Click on cells to edit.
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={18} className="mr-2" />
          Add Content
        </Button>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1333] border-b border-[#563EB7]/20">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Design Brief
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Inspiration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Design
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Text Content
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Drive Link
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {localContent.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    No content items yet. Click &quot;Add Content&quot; to create one.
                  </td>
                </tr>
              ) : (
                localContent.map((item, index) => {
                  // Use item directly from localContent for full reactivity
                  const statusInfo = getStatusBadge(item.status);
                  
                  return (
                    <tr key={item.id} className="hover:bg-[#1a1333]/50 transition-colors">
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <EditableCell contentId={String(item.id)} field="design-brief" />
                      <EditableCell contentId={String(item.id)} field="inspiration" />
                      <EditableCell contentId={String(item.id)} field="design" />
                      <EditableCell contentId={String(item.id)} field="text-content" />
                      <EditableCell contentId={String(item.id)} field="drive-link" />
                      <EditableCell contentId={String(item.id)} field="notes" />
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-[#1a1333] border border-[#563EB7]/30 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#563EB7] cursor-pointer hover:border-[#563EB7]/60 transition-colors"
                        >
                          <option value="idea">Idea</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="approved">Approved</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        <div className="flex items-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditContent(item)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-all"
                            title="Edit Content"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete Button */}
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteContent(item.id)}
                                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
                              title="Delete Content"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                          {/* Mark as Ready Button */}
                          {!item.readyForCalendar && ['approved', 'scheduled', 'published'].includes(item.status) && (
                            <button
                              onClick={() => handleMarkReady(item.id)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors flex items-center gap-1"
                              title="Mark as Ready for Calendar"
                            >
                              <Check size={14} />
                              Ready
                            </button>
                          )}

                          {/* Ready Badge */}
                          {item.readyForCalendar && (
                            <Badge variant="success" size="sm">
                              <Check size={12} className="mr-1" />
                              Ready
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm text-blue-400">
          <strong>Your role ({userRole}):</strong> You can edit specific columns based on your permissions.
          Gray cells are read-only for you.
        </p>
      </div>

      {/* Edit Content Modal */}
      {editingContent && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingContent(null);
          }}
          title="Edit Content"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingContent(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Title"
              value={editingContent.title}
              onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
              placeholder="Content title"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Due Date"
                type="date"
                value={editingContent.dueDate}
                onChange={(e) => setEditingContent({ ...editingContent, dueDate: e.target.value })}
                required
              />

              <Select
                label="Priority"
                value={editingContent.priority}
                onChange={(e) => setEditingContent({ ...editingContent, priority: e.target.value as Content['priority'] })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
              />
            </div>

            <Select
            label="Assigned To"
            value={editingContent.assignedTo}
            onChange={(e) => setEditingContent({ ...editingContent, assignedTo: e.target.value })}
            options={activeUsers.map(u => ({ value: u.id, label: u.name }))}
            />
          </div>
        </Modal>
      )}
      {/* Add Content Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !submitting && setIsAddModalOpen(false)}
        title="Add New Content"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setIsAddModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitAdd}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Content'
              )}
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
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Content Type"
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value as Content['contentType'] })}
              options={[
                { value: 'post', label: 'Post' },
                { value: 'story', label: 'Story' },
                { value: 'video', label: 'Video' },
                { value: 'carousel', label: 'Carousel' },
              ]}
            />

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
            options={activeUsers.map(u => ({ 
              value: u.id, 
              label: u.name 
            }))}
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
              { value: 'published', label: 'Published' },
            ]}
          />

          {/* Additional Content Fields */}
          <div className="border-t border-[#563EB7]/20 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Content Details</h3>
            
            <div className="space-y-3">
              <Input
                label="Design Brief"
                value={formData.designBrief}
                onChange={(e) => setFormData({ ...formData, designBrief: e.target.value })}
                placeholder="Brief description of design requirements"
              />

              <Input
                label="Inspiration"
                value={formData.inspiration}
                onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                placeholder="Links or references for inspiration"
              />

              <Input
                label="Design"
                value={formData.design}
                onChange={(e) => setFormData({ ...formData, design: e.target.value })}
                placeholder="Design file link or details"
              />

              <Input
                label="Text Content"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                placeholder="Caption or text for the content"
              />

              <Input
                label="Drive Link"
                value={formData.driveLink}
                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                placeholder="Google Drive or file link"
              />

              <Input
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

