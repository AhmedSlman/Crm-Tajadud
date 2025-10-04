'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { Shield, RotateCcw, Save, CheckCircle, XCircle, Plus, Trash2, Edit } from 'lucide-react';
import { UserRole, ColumnName } from '@/types';
import { toast } from 'sonner';

export default function PermissionsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <PermissionsContent />
    </ProtectedRoute>
  );
}

function PermissionsContent() {
  const { 
    permissions, 
    updatePermission, 
    resetPermissions, 
    getAllRoles,
    addCustomRole,
    updateCustomRole,
    deleteCustomRole 
  } = useData();
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{ value: string; label: string; emoji: string } | null>(null);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState<string | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    label: '',
    emoji: '👤',
  });

  const roles = getAllRoles();

  const columns: { value: ColumnName; label: string }[] = [
    { value: 'design-brief', label: 'Design Brief' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'design', label: 'Design' },
    { value: 'text-content', label: 'Text Content' },
    { value: 'drive-link', label: 'Drive Link' },
    { value: 'notes', label: 'Notes' },
    { value: 'status', label: 'Status' },
  ];

  const canEdit = (role: UserRole, column: ColumnName): boolean => {
    const perm = permissions.find(p => p.role === role && p.column === column);
    return perm?.canEdit || false;
  };

  const togglePermission = (role: UserRole, column: ColumnName) => {
    const currentValue = canEdit(role, column);
    const newValue = !currentValue;
    updatePermission(role, column, newValue);
    setHasChanges(true);
    
    // Show toast notification
    const roleLabel = roles.find(r => r.value === role)?.label;
    const columnLabel = columns.find(c => c.value === column)?.label;
    
    if (newValue) {
      toast.success(`Permission granted! ✅`, {
        description: `${roleLabel} can now edit ${columnLabel}`,
      });
    } else {
      toast.info(`Permission revoked`, {
        description: `${roleLabel} cannot edit ${columnLabel} anymore`,
      });
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all permissions to default?')) {
      resetPermissions();
      setHasChanges(false);
      toast.success('Permissions reset to default! 🔄', {
        description: 'All roles now have default permissions',
      });
    }
  };

  const handleSave = () => {
    // Permissions are already saved in localStorage via updatePermission
    setHasChanges(false);
    toast.success('Permissions saved successfully! 💾', {
      description: 'Changes have been applied',
    });
  };

  const handleAddRole = async () => {
    if (!roleFormData.name || !roleFormData.label) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if role name already exists
    if (roles.some(r => r.value === roleFormData.name)) {
      toast.error('Role name already exists');
      return;
    }

    try {
      await addCustomRole({
        name: roleFormData.name,
        label: roleFormData.label,
        emoji: roleFormData.emoji,
        isCustom: true,
        createdBy: 'admin', // Current user
      });

      toast.success(`${roleFormData.label} role created! 🎉`, {
        description: 'You can now assign permissions to this role',
      });

      setIsAddRoleModalOpen(false);
      setRoleFormData({ name: '', label: '', emoji: '👤' });
    } catch (error) {
      toast.error('Failed to create role');
    }
  };

  const handleEditRole = (role: { value: string; label: string; emoji: string }) => {
    setEditingRole(role);
    setRoleFormData({
      name: role.value,
      label: role.label,
      emoji: role.emoji,
    });
    setIsEditRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !roleFormData.label) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Find the custom role by name
      const roleToUpdate = roles.find(r => r.value === editingRole.value && r.isCustom);
      if (!roleToUpdate) {
        toast.error('Cannot edit default roles');
        return;
      }

      await updateCustomRole(roleToUpdate.value, {
        label: roleFormData.label,
        emoji: roleFormData.emoji,
      });

      toast.success(`${roleFormData.label} updated! ✅`);
      setIsEditRoleModalOpen(false);
      setEditingRole(null);
      setRoleFormData({ name: '', label: '', emoji: '👤' });
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    const role = roles.find(r => r.value === roleName);
    if (!role?.isCustom) {
      toast.error('Cannot delete default roles');
      return;
    }

    try {
      await deleteCustomRole(roleName);
      toast.success(`${role.label} deleted! 🗑️`, {
        description: 'Role and its permissions have been removed',
      });
      setDeleteConfirmRole(null);
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Permissions Management
          </h1>
          <p className="text-gray-400 text-lg">Configure role-based access control for Content Plan</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setIsAddRoleModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Add Role
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw size={20} className="mr-2" />
            Reset to Default
          </Button>
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card hover={false}>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
          <Shield className="text-blue-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-white font-semibold mb-1">About Permissions</h3>
            <p className="text-sm text-gray-400">
              Configure which roles can edit which columns in Content Plan and Reels Plan tables. 
              Click on any checkbox to toggle permissions. Changes are saved automatically to localStorage.
            </p>
          </div>
        </div>
      </Card>

      {/* Permissions Matrix */}
      <Card title="Permissions Matrix">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#563EB7]/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400 sticky left-0 bg-[#14102a] z-10">
                  Role \ Column
                </th>
                {columns.map(col => (
                  <th key={col.value} className="px-4 py-3 text-center text-sm font-semibold text-gray-400">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, roleIndex) => (
                <tr 
                  key={role.value}
                  className={`border-b border-[#563EB7]/10 hover:bg-[#1a1333]/50 transition-colors ${
                    roleIndex % 2 === 0 ? 'bg-[#1a1333]/20' : ''
                  }`}
                >
                  <td className="px-4 py-4 sticky left-0 bg-[#14102a] z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{role.emoji}</span>
                        <span className="text-white font-medium">{role.label}</span>
                        {role.isCustom && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Custom</span>
                        )}
                      </div>
                      {role.isCustom && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-all"
                            title="Edit Role"
                          >
                            <Edit size={14} />
                          </button>
                          {deleteConfirmRole === role.value ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteRole(role.value)}
                                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmRole(null)}
                                className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmRole(role.value)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all"
                              title="Delete Role"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  {columns.map(col => {
                    const hasPermission = canEdit(role.value, col.value);
                    const isAdmin = role.value === 'admin';
                    
                    return (
                      <td key={col.value} className="px-4 py-4 text-center">
                        <button
                          onClick={() => !isAdmin && togglePermission(role.value, col.value)}
                          disabled={isAdmin}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <Card title="Legend" hover={false}>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500/20 border-2 border-green-500/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-400" size={16} />
            </div>
            <span className="text-white text-sm">Can Edit - User can edit this column</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500/20 border-2 border-red-500/50 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-400" size={16} />
            </div>
            <span className="text-white text-sm">Read Only - User can only view this column</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="text-[#563EB7]" size={20} />
            <span className="text-gray-400 text-sm">Admin always has all permissions</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {permissions.filter(p => p.canEdit).length}
            </div>
            <p className="text-sm text-gray-400">Active Permissions</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {roles.length}
            </div>
            <p className="text-sm text-gray-400">Total Roles</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {columns.length}
            </div>
            <p className="text-sm text-gray-400">Total Columns</p>
          </div>
        </Card>
      </div>

      {/* Add Role Modal */}
      <Modal
        isOpen={isAddRoleModalOpen}
        onClose={() => {
          setIsAddRoleModalOpen(false);
          setRoleFormData({ name: '', label: '', emoji: '👤' });
        }}
        title="Add New Role"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Role Name (ID) *
            </label>
            <Input
              type="text"
              placeholder="e.g., project-manager"
              value={roleFormData.name}
              onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be used as the unique identifier (lowercase, no spaces)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Display Label *
            </label>
            <Input
              type="text"
              placeholder="e.g., Project Manager"
              value={roleFormData.label}
              onChange={(e) => setRoleFormData({ ...roleFormData, label: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Emoji
            </label>
            <Input
              type="text"
              placeholder="👤"
              value={roleFormData.emoji}
              onChange={(e) => setRoleFormData({ ...roleFormData, emoji: e.target.value })}
              className="w-full"
              maxLength={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddRoleModalOpen(false);
                setRoleFormData({ name: '', label: '', emoji: '👤' });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleAddRole} className="flex-1">
              <Plus size={16} className="mr-2" />
              Add Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditRoleModalOpen}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setEditingRole(null);
          setRoleFormData({ name: '', label: '', emoji: '👤' });
        }}
        title="Edit Role"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Role Name (ID)
            </label>
            <Input
              type="text"
              value={roleFormData.name}
              disabled
              className="w-full opacity-50"
            />
            <p className="text-xs text-gray-400 mt-1">
              Role ID cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Display Label *
            </label>
            <Input
              type="text"
              placeholder="e.g., Project Manager"
              value={roleFormData.label}
              onChange={(e) => setRoleFormData({ ...roleFormData, label: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Emoji
            </label>
            <Input
              type="text"
              placeholder="👤"
              value={roleFormData.emoji}
              onChange={(e) => setRoleFormData({ ...roleFormData, emoji: e.target.value })}
              className="w-full"
              maxLength={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditRoleModalOpen(false);
                setEditingRole(null);
                setRoleFormData({ name: '', label: '', emoji: '👤' });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="flex-1">
              <Edit size={16} className="mr-2" />
              Update Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

