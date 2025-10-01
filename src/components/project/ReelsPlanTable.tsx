'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Content, UserRole, ColumnName } from '@/types';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { Plus, Edit2, Check, X, Video, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

type ReelsPlanTableProps = {
  reels: Content[];
  projectId: string;
  month: string;
  userRole: UserRole;
};

export default function ReelsPlanTable({ reels, projectId, month, userRole }: ReelsPlanTableProps) {
  const { addContent, updateContent, deleteContent, users, canUserEdit } = useData();
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Content | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEditStart = (contentId: string, field: string, currentValue: string) => {
    setEditingCell({ id: contentId, field });
    setEditValue(currentValue || '');
  };

  const handleEditSave = async () => {
    if (!editingCell) return;

    try {
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

      await updateContent(editingCell.id, updates);
      setEditingCell(null);
      setEditValue('');
      toast.success('Reel updated! ✅', {
        description: `${editingCell.field.replace('-', ' ')} has been saved`,
      });
    } catch (error) {
      toast.error('Failed to update reel');
    }
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleAddReel = async () => {
    try {
      await addContent({
        title: 'New Reel',
        contentType: 'video',
        status: 'idea',
        projectId,
        assignedTo: users[0]?.id || '',
        createdBy: '1',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        progress: 0,
        month,
        isReel: true, // This is the key difference!
        readyForCalendar: false,
      });
      toast.success('Reel added! 🎬', {
        description: 'You can now fill in the details',
      });
    } catch (error) {
      toast.error('Failed to add reel');
    }
  };

  const handleMarkReady = async (contentId: string) => {
    try {
      const item = reels.find(c => c.id === contentId);
      await updateContent(contentId, { readyForCalendar: true, status: 'approved' });
      toast.success(`${item?.title} is ready for calendar! 📅`, {
        description: 'You can now drag it to the social calendar',
      });
    } catch (error) {
      toast.error('Failed to mark reel as ready');
    }
  };

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    try {
      await updateContent(contentId, { status: newStatus as Content['status'] });
      toast.success('Status updated!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEditReel = (reelItem: Content) => {
    setEditingReel(reelItem);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReel) return;

    try {
      await updateContent(editingReel.id, {
        title: editingReel.title,
        dueDate: editingReel.dueDate,
        assignedTo: editingReel.assignedTo,
        priority: editingReel.priority,
      });
      toast.success('Reel updated! ✅');
      setIsEditModalOpen(false);
      setEditingReel(null);
    } catch (error) {
      toast.error('Failed to update reel');
    }
  };

  const handleDeleteReel = async (reelId: string) => {
    try {
      const item = reels.find(r => r.id === reelId);
      await deleteContent(reelId);
      toast.success(`${item?.title} deleted! 🗑️`);
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error('Failed to delete reel');
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
    content: contentItem, 
    field, 
    value 
  }: { 
    content: Content; 
    field: string; 
    value: string 
  }) => {
    const canEdit = canUserEdit(userRole, field as ColumnName);
    const isEditing = editingCell?.id === contentItem.id && editingCell?.field === field;

    if (!canEdit) {
      return (
        <td className="px-4 py-3 border-b border-[#563EB7]/10">
          <div className="text-gray-500 text-sm">{value || '—'}</div>
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
            onClick={() => handleEditStart(contentItem.id, field, value)}
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="text-purple-400" size={24} />
            Reels Plan
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your Instagram Reels workflow
          </p>
        </div>
        <Button onClick={handleAddReel}>
          <Plus size={18} className="mr-2" />
          Add Reel
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
              {reels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    No reels yet. Click &quot;Add Reel&quot; to create one.
                  </td>
                </tr>
              ) : (
                reels.map((item) => {
                  const statusInfo = getStatusBadge(item.status);
                  
                  return (
                    <tr key={item.id} className="hover:bg-[#1a1333]/50 transition-colors">
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        <div className="flex items-center gap-2">
                          <Video size={16} className="text-purple-400" />
                          <div>
                            <div className="font-medium text-white">{item.title}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(item.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <EditableCell content={item} field="design-brief" value={item.designBrief || ''} />
                      <EditableCell content={item} field="inspiration" value={item.inspiration || ''} />
                      <EditableCell content={item} field="design" value={item.design || ''} />
                      <EditableCell content={item} field="text-content" value={item.textContent || ''} />
                      <EditableCell content={item} field="drive-link" value={item.driveLink || ''} />
                      <EditableCell content={item} field="notes" value={item.notes || ''} />
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
                            onClick={() => handleEditReel(item)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-all"
                            title="Edit Reel"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete Button */}
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteReel(item.id)}
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
                              title="Delete Reel"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                          {/* Mark as Ready Button */}
                          {!item.readyForCalendar && (item.status === 'approved' || item.status === 'review') && (
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
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
        <p className="text-sm text-purple-400">
          <strong>🎬 Reels Plan:</strong> Instagram Reels workflow. Your role ({userRole}): You can edit specific columns based on your permissions.
        </p>
      </div>

      {/* Edit Reel Modal */}
      {editingReel && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReel(null);
          }}
          title="Edit Reel"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingReel(null);
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
              value={editingReel.title}
              onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
              placeholder="Reel title"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Due Date"
                type="date"
                value={editingReel.dueDate}
                onChange={(e) => setEditingReel({ ...editingReel, dueDate: e.target.value })}
                required
              />

              <Select
                label="Priority"
                value={editingReel.priority}
                onChange={(e) => setEditingReel({ ...editingReel, priority: e.target.value as Content['priority'] })}
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
              value={editingReel.assignedTo}
              onChange={(e) => setEditingReel({ ...editingReel, assignedTo: e.target.value })}
              options={users.map(u => ({ value: u.id, label: u.name }))}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

