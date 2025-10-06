'use client';

import { useState } from 'react';
import * as React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { CheckCircle, XCircle, Plus, Edit2, Trash2, RotateCcw, Shield } from 'lucide-react';
import { UserRole, ColumnName, ResourceType, ActionType } from '@/types';
import { toast } from 'sonner';

export default function PermissionsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PermissionsContent />
    </ProtectedRoute>
  );
}

function PermissionsContent() {
  const { 
    permissions,
    actionPermissions: globalActionPermissions,
    updatePermission,
    updateActionPermission,
    resetPermissions, 
    getAllRoles,
    addCustomRole,
    updateCustomRole,
    deleteCustomRole 
  } = useData();
  
  const [activeTab, setActiveTab] = useState<'fields' | 'actions'>('actions');
  const [hasChanges, setHasChanges] = useState(false);
  const [localActionPermissions, setLocalActionPermissions] = useState(globalActionPermissions);
  
  // Sync with global state
  React.useEffect(() => {
    setLocalActionPermissions(globalActionPermissions);
  }, [globalActionPermissions]);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{ id?: string; value: string; label: string; emoji: string } | null>(null);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState<{ id?: string; value: string; label: string } | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    label: '',
    emoji: '👤',
  });

  const roles = getAllRoles();

  // Field columns (for content editing)
  const fieldColumns: { value: ColumnName; label: string }[] = [
    { value: 'design-brief', label: 'Design Brief' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'design', label: 'Design' },
    { value: 'text-content', label: 'Text Content' },
    { value: 'drive-link', label: 'Drive Link' },
    { value: 'notes', label: 'Notes' },
    { value: 'status', label: 'Status' },
  ];

  // Resources (for CRUD operations)
  const resources: { value: ResourceType; label: string; icon: string }[] = [
    { value: 'tasks', label: 'Tasks', icon: '✅' },
    { value: 'content', label: 'Content', icon: '📝' },
    { value: 'campaigns', label: 'Campaigns', icon: '📢' },
    { value: 'projects', label: 'Projects', icon: '📁' },
    { value: 'clients', label: 'Clients', icon: '👥' },
    { value: 'users', label: 'Users', icon: '👤' },
  ];

  // Actions
  const actions: { value: ActionType; label: string; color: string }[] = [
    { value: 'create', label: 'Create', color: 'text-green-400' },
    { value: 'update', label: 'Edit', color: 'text-blue-400' },
    { value: 'delete', label: 'Delete', color: 'text-red-400' },
    { value: 'view', label: 'View', color: 'text-gray-400' },
  ];

  const canEdit = (role: UserRole, column: ColumnName): boolean => {
    // Admin always has all permissions
    if (role === 'admin') {
      return true;
    }
    
    const perm = permissions.find(p => p.role === role && p.column === column);
    return perm?.canEdit || false;
  };

  const canPerform = (role: UserRole, resource: ResourceType, action: ActionType): boolean => {
    // Admin always has all permissions
    if (role === 'admin') {
      return true;
    }
    
    const perm = localActionPermissions.find(p => p.role === role && p.resource === resource && p.action === action);
    return perm?.canPerform || false;
  };

  const toggleFieldPermission = (role: UserRole, column: ColumnName) => {
    if (role === 'admin') {
      toast.warning('Admin always has all permissions and cannot be modified');
      return;
    }
    
    const currentValue = canEdit(role, column);
    updatePermission(role, column, !currentValue);
    setHasChanges(true);
  };

  const toggleActionPermission = async (role: UserRole, resource: ResourceType, action: ActionType) => {
    if (role === 'admin') {
      toast.warning('Admin always has all permissions and cannot be modified');
      return;
    }
    
    try {
      const currentValue = canPerform(role, resource, action);
      const newValue = !currentValue;
      
      // Optimistic update - update local state immediately
      setLocalActionPermissions(prev => 
        prev.map(p => 
          p.role === role && p.resource === resource && p.action === action
            ? { ...p, canPerform: newValue }
            : p
        )
      );
      
      // Then update backend
      await updateActionPermission(role, resource, action, newValue);
      toast.success('Permission updated');
    } catch (error) {
      // Revert on error
      setLocalActionPermissions(globalActionPermissions);
      toast.error('Failed to update permission');
    }
  };

  const handleSaveChanges = () => {
    toast.success('All changes have been saved successfully');
    setHasChanges(false);
  };

  const handleResetToDefault = async () => {
    if (confirm('Are you sure you want to reset all permissions to default? This cannot be undone.')) {
      await resetPermissions();
      setHasChanges(false);
    }
  };

  const handleAddRole = async () => {
    if (!roleFormData.name || !roleFormData.label) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addCustomRole({
        name: roleFormData.name,
        label: roleFormData.label,
        emoji: roleFormData.emoji,
        isCustom: true,
        createdBy: 'admin',
      });
      toast.success('Custom role added successfully');
      setIsAddRoleModalOpen(false);
      setRoleFormData({ name: '', label: '', emoji: '👤' });
    } catch (error) {
      console.error('Add role error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add custom role');
    }
  };

  const handleEditRole = async () => {
    if (!editingRole || !editingRole.id) return;

    try {
      await updateCustomRole(editingRole.id, {
        label: editingRole.label,
        emoji: editingRole.emoji,
      });
      toast.success('Role updated successfully');
      setIsEditRoleModalOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Update role error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteConfirmRole || !deleteConfirmRole.id) return;

    try {
      await deleteCustomRole(deleteConfirmRole.id);
      toast.success('Role deleted successfully');
      setDeleteConfirmRole(null);
    } catch (error) {
      console.error('Delete role error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete role';
      
      // Show the exact error message from the backend
      if (errorMessage.includes('assigned') || errorMessage.includes('user')) {
        // Extract user count if available
        const userCountMatch = errorMessage.match(/(\d+)\s+user/i);
        if (userCountMatch) {
          const count = userCountMatch[1];
          toast.error(`Cannot delete role: It is currently assigned to ${count} user(s). Please reassign them first.`, {
            duration: 5000,
          });
        } else {
          toast.error('Cannot delete role: It is currently assigned to one or more users. Please reassign them first.', {
            duration: 5000,
          });
        }
      } else {
        toast.error(errorMessage, { duration: 4000 });
      }
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Permissions Management</h1>
          <p className="text-gray-400 mt-2">Manage role permissions and custom roles</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && activeTab === 'fields' && (
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          )}
          <Button variant="secondary" onClick={handleResetToDefault}>
            <RotateCcw size={18} className="mr-2" />
            Reset to Default
          </Button>
          <Button variant="primary" onClick={() => setIsAddRoleModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Add Custom Role
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#563EB7]/20">
        <button
          onClick={() => setActiveTab('actions')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'actions'
              ? 'text-white border-b-2 border-[#563EB7]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Shield size={18} className="inline mr-2" />
          Actions (Create, Edit, Delete)
        </button>
        <button
          onClick={() => setActiveTab('fields')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'fields'
              ? 'text-white border-b-2 border-[#563EB7]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Edit2 size={18} className="inline mr-2" />
          Fields (Content Columns)
        </button>
      </div>

      {/* Actions Permissions Matrix */}
      {activeTab === 'actions' && (
        <Card title="Action Permissions Matrix" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#563EB7]/20">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 sticky left-0 bg-[#0F1117] z-10">
                    Role
                  </th>
                  {resources.map((resource) => (
                    <th
                      key={resource.value}
                      colSpan={4}
                      className="px-4 py-3 text-center text-sm font-semibold text-gray-300 border-l border-[#563EB7]/20"
                    >
                      {resource.icon} {resource.label}
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
                <tr className="border-b border-[#563EB7]/10">
                  <th className="px-4 py-2"></th>
                  {resources.map((resource) => (
                    <React.Fragment key={resource.value}>
                      {actions.map((action) => (
                        <th
                          key={`${resource.value}-${action.value}`}
                          className={`px-2 py-2 text-center text-xs ${action.color}`}
                        >
                          {action.label}
                        </th>
                      ))}
                    </React.Fragment>
                  ))}
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, roleIndex) => (
                  <tr
                    key={role.value}
                    className={`border-b border-[#563EB7]/10 hover:bg-[#563EB7]/5 ${
                      roleIndex % 2 === 0 ? 'bg-[#563EB7]/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-white font-medium sticky left-0 bg-[#0F1117] z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{role.emoji}</span>
                        <div>
                          <div>{role.label}</div>
                          {role.isCustom && (
                            <div className="text-xs text-blue-400">Custom</div>
                          )}
                        </div>
                      </div>
                    </td>
                    {resources.map((resource) => (
                      <React.Fragment key={`${role.value}-${resource.value}`}>
                        {actions.map((action) => {
                          const hasPermission = canPerform(role.value, resource.value, action.value);
                          const isAdmin = role.value === 'admin';

                          return (
                            <td key={`${resource.value}-${action.value}`} className="px-2 py-3 text-center">
                              <button
                                onClick={() => !isAdmin && toggleActionPermission(role.value, resource.value, action.value)}
                                disabled={isAdmin}
                                className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 mx-auto
                                  ${
                                    hasPermission
                                      ? 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50'
                                      : 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50'
                                  }
                                  ${isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
                                `}
                                title={isAdmin ? 'Admin has all permissions' : `Click to ${hasPermission ? 'revoke' : 'grant'} ${action.label} on ${resource.label}`}
                              >
                                {hasPermission ? (
                                  <CheckCircle className="text-green-400" size={16} />
                                ) : (
                                  <XCircle className="text-red-400" size={16} />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </React.Fragment>
                    ))}
                    <td className="px-4 py-3">
                      {role.value !== 'admin' && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingRole(role);
                              setIsEditRoleModalOpen(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDeleteConfirmRole(role)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Field Permissions Matrix */}
      {activeTab === 'fields' && (
        <Card title="Field Permissions Matrix (Content Columns)" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#563EB7]/20">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">
                    Role
                  </th>
                  {fieldColumns.map((col) => (
                    <th
                      key={col.value}
                      className="px-4 py-4 text-center text-sm font-semibold text-gray-300"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, roleIndex) => (
                  <tr
                    key={role.value}
                    className={`border-b border-[#563EB7]/10 hover:bg-[#563EB7]/5 ${
                      roleIndex % 2 === 0 ? 'bg-[#563EB7]/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{role.emoji}</span>
                        <div>
                          <div>{role.label}</div>
                          {role.isCustom && (
                            <div className="text-xs text-blue-400">Custom</div>
                          )}
                        </div>
                      </div>
                    </td>
                    {fieldColumns.map(col => {
                      const hasPermission = canEdit(role.value, col.value);
                      const isAdmin = role.value === 'admin';
                      
                      return (
                        <td key={col.value} className="px-4 py-4 text-center">
                          <button
                            onClick={() => !isAdmin && toggleFieldPermission(role.value, col.value)}
                            disabled={isAdmin}
                            className={`
                              w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 mx-auto
                              ${hasPermission 
                                ? 'bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50' 
                                : 'bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50'
                              }
                              ${isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
                            `}
                            title={isAdmin ? 'Admin has all permissions' : `Click to ${hasPermission ? 'revoke' : 'grant'} permission`}
                          >
                            {hasPermission ? (
                              <CheckCircle className="text-green-400" size={20} />
                            ) : (
                              <XCircle className="text-red-400" size={20} />
                            )}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      {role.value !== 'admin' && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingRole(role);
                              setIsEditRoleModalOpen(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDeleteConfirmRole(role)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card title="Legend" hover={false}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={24} />
            <div>
              <div className="font-semibold text-white">Has Permission</div>
              <div className="text-sm text-gray-400">Can perform this action</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <XCircle className="text-red-400" size={24} />
            <div>
              <div className="font-semibold text-white">No Permission</div>
              <div className="text-sm text-gray-400">Cannot perform this action</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Custom Role Modal */}
      <Modal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        title="Add Custom Role"
      >
        <div className="space-y-4">
          <Input
            label="Role Name (lowercase, no spaces)"
            placeholder="e.g. project-manager"
            value={roleFormData.name}
            onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
          />
          <Input
            label="Display Label"
            placeholder="e.g. Project Manager"
            value={roleFormData.label}
            onChange={(e) => setRoleFormData({ ...roleFormData, label: e.target.value })}
          />
          <Input
            label="Emoji"
            placeholder="👤"
            value={roleFormData.emoji}
            onChange={(e) => setRoleFormData({ ...roleFormData, emoji: e.target.value })}
            maxLength={2}
          />
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleAddRole}>
              Add Role
            </Button>
            <Button variant="secondary" onClick={() => setIsAddRoleModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      {editingRole && (
        <Modal
          isOpen={isEditRoleModalOpen}
          onClose={() => setIsEditRoleModalOpen(false)}
          title="Edit Role"
        >
          <div className="space-y-4">
            <Input
              label="Display Label"
              value={editingRole.label}
              onChange={(e) => setEditingRole({ ...editingRole, label: e.target.value })}
            />
            <Input
              label="Emoji"
              value={editingRole.emoji}
              onChange={(e) => setEditingRole({ ...editingRole, emoji: e.target.value })}
              maxLength={2}
            />
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleEditRole}>
                Update
              </Button>
              <Button variant="secondary" onClick={() => setIsEditRoleModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmRole}
        onClose={() => setDeleteConfirmRole(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete <span className="font-bold text-white">{deleteConfirmRole?.label}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDeleteRole}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setDeleteConfirmRole(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
