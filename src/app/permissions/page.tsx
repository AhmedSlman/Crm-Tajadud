'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Shield, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';
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
  const { permissions, updatePermission, resetPermissions } = useData();
  const [hasChanges, setHasChanges] = useState(false);

  const roles: { value: UserRole; label: string; emoji: string }[] = [
    { value: 'admin', label: 'Admin', emoji: '👑' },
    { value: 'account-manager', label: 'Account Manager', emoji: '👔' },
    { value: 'graphic-designer', label: 'Graphic Designer', emoji: '🎨' },
    { value: 'social-media', label: 'Social Media', emoji: '📱' },
    { value: 'content-writer', label: 'Content Writer', emoji: '✍️' },
    { value: 'video-editor', label: 'Video Editor', emoji: '🎬' },
    { value: 'ads-specialist', label: 'Ads Specialist', emoji: '📢' },
    { value: 'seo-specialist', label: 'SEO Specialist', emoji: '🔍' },
  ];

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
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{role.emoji}</span>
                      <span className="text-white font-medium">{role.label}</span>
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
    </div>
  );
}

