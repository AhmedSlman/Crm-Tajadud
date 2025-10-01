'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Content, UserRole } from '@/types';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Plus, Edit2, Check, X } from 'lucide-react';

type ContentPlanTableProps = {
  content: Content[];
  projectId: string;
  month: string;
  userRole: UserRole;
};

// Define which roles can edit which columns
const COLUMN_PERMISSIONS: Record<string, UserRole[]> = {
  'design-brief': ['admin', 'account-manager', 'social-media'],
  'inspiration': ['admin', 'account-manager', 'social-media', 'graphic-designer'],
  'design': ['admin', 'graphic-designer'],
  'text-content': ['admin', 'account-manager', 'social-media', 'content-writer'],
  'drive-link': ['admin', 'account-manager', 'graphic-designer', 'video-editor'],
  'notes': ['admin', 'account-manager', 'social-media'],
  'status': ['admin', 'account-manager', 'social-media'],
};

function canEditColumn(column: string, userRole: UserRole): boolean {
  const allowedRoles = COLUMN_PERMISSIONS[column];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
}

export default function ContentPlanTable({ 
  content, 
  projectId, 
  month, 
  userRole 
}: ContentPlanTableProps) {
  const { addContent, updateContent, users } = useData();
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (contentId: string, field: string, currentValue: string) => {
    setEditingCell({ id: contentId, field });
    setEditValue(currentValue || '');
  };

  const handleEditSave = () => {
    if (!editingCell) return;

    const updates: Partial<Content> = {
      [editingCell.field]: editValue,
    };

    updateContent(editingCell.id, updates);
    setEditingCell(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleAddContent = () => {
    addContent({
      title: 'New Content Item',
      contentType: 'post',
      status: 'idea',
      projectId,
      assignedTo: users[0]?.id || '',
      createdBy: '1',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      progress: 0,
      month,
      isReel: false,
      readyForCalendar: false,
    });
  };

  const handleMarkReady = (contentId: string) => {
    updateContent(contentId, { readyForCalendar: true, status: 'approved' });
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
    const canEdit = canEditColumn(field, userRole);
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
          <h2 className="text-xl font-bold text-white">Content Plan</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your content workflow. Click on cells to edit.
          </p>
        </div>
        <Button onClick={handleAddContent}>
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
              {content.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    No content items yet. Click &quot;Add Content&quot; to create one.
                  </td>
                </tr>
              ) : (
                content.map((item) => {
                  const statusInfo = getStatusBadge(item.status);
                  
                  return (
                    <tr key={item.id} className="hover:bg-[#1a1333]/50 transition-colors">
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <EditableCell content={item} field="design-brief" value={item.designBrief || ''} />
                      <EditableCell content={item} field="inspiration" value={item.inspiration || ''} />
                      <EditableCell content={item} field="design" value={item.design || ''} />
                      <EditableCell content={item} field="text-content" value={item.textContent || ''} />
                      <EditableCell content={item} field="drive-link" value={item.driveLink || ''} />
                      <EditableCell content={item} field="notes" value={item.notes || ''} />
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        <Badge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 border-b border-[#563EB7]/10">
                        {!item.readyForCalendar && item.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleMarkReady(item.id)}
                          >
                            <Check size={14} className="mr-1" />
                            Ready
                          </Button>
                        )}
                        {item.readyForCalendar && (
                          <Badge variant="success" size="sm">
                            <Check size={12} className="mr-1" />
                            Ready for Calendar
                          </Badge>
                        )}
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
    </div>
  );
}

