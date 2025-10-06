'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { CheckCircle, XCircle, UserCog, Ban, Users as UsersIcon, Mail, Phone, Trash2 } from 'lucide-react';
import { User, UserStatus } from '@/types';
import { toast } from 'sonner';

export default function UsersManagementPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <UsersManagementContent />
    </ProtectedRoute>
  );
}

function UsersManagementContent() {
  const { users, approveUser, rejectUser, suspendUser, activateUser, deleteUser } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | UserStatus>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter users
  const filteredUsers = users.filter(user => {
    // Status filter
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');
  const suspendedUsers = users.filter(u => u.status === 'suspended');

  const handleApprove = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    try {
      await approveUser(userId);
      toast.success(`${user?.name} has been approved! ✅`, {
        description: 'User can now log in to the system',
      });
    } catch (error) {
      toast.error('Failed to approve user', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleReject = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (confirm(`Are you sure you want to reject and delete ${user?.name}?`)) {
      try {
        await rejectUser(userId);
        toast.success(`${user?.name} has been rejected and removed! ❌`, {
          description: 'User account has been deleted',
        });
      } catch (error) {
        toast.error('Failed to reject user', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      }
    }
  };

  const handleSuspend = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (confirm(`Are you sure you want to suspend ${user?.name}?`)) {
      try {
        await suspendUser(userId);
        toast.warning(`${user?.name} has been suspended! 🚫`, {
          description: 'User cannot log in until reactivated',
        });
      } catch (error) {
        toast.error('Failed to suspend user', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      }
    }
  };

  const handleActivate = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    try {
      await activateUser(userId);
      toast.success(`${user?.name} has been activated! ✅`, {
        description: 'User can now log in to the system',
      });
    } catch (error) {
      toast.error('Failed to activate user', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    
    if (!confirm(`Are you sure you want to delete ${user?.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success(`${user?.name} has been deleted`, {
        description: 'User removed from the system',
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete user';
      
      if (errorMessage.includes('admin')) {
        toast.error('Cannot delete admin users', {
          description: 'Admin users are protected from deletion',
        });
      } else {
        toast.error('Failed to delete user', {
          description: errorMessage,
        });
      }
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusMap: Record<UserStatus, 'success' | 'warning' | 'danger'> = {
      'active': 'success',
      'pending': 'warning',
      'suspended': 'danger',
    };
    return statusMap[status];
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': '👑 Admin',
      'account-manager': '👔 Account Manager',
      'graphic-designer': '🎨 Graphic Designer',
      'social-media': '📱 Social Media',
      'content-writer': '✍️ Content Writer',
      'video-editor': '🎬 Video Editor',
      'ads-specialist': '📢 Ads Specialist',
      'seo-specialist': '🔍 SEO Specialist',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Users Management
          </h1>
          <p className="text-gray-400 text-lg">Approve and manage team members</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{users.length}</div>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{activeUsers.length}</div>
            <p className="text-sm text-gray-400">Active Users</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{pendingUsers.length}</div>
            <p className="text-sm text-gray-400">Pending Approval</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">{suspendedUsers.length}</div>
            <p className="text-sm text-gray-400">Suspended</p>
          </div>
        </Card>
      </div>

      {/* Pending Approvals - Priority Section */}
      {pendingUsers.length > 0 && (
        <Card title="⏳ Pending Approvals" className="border-yellow-500/30">
          <div className="space-y-3">
            {pendingUsers.map(user => (
              <div
                key={user.id}
                className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-xl hover:border-yellow-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail size={14} />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Phone size={14} />
                            {user.phone}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <Badge variant="warning" size="sm">
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleApprove(user.id)}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(user.id)}
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search users by name, email, role..."
            onSearch={setSearchQuery}
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filterStatus === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'active' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filterStatus === 'suspended' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('suspended')}
          >
            Suspended
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={<UsersIcon size={48} className="text-[#563EB7]" />}
            title="No users found"
            description="Try adjusting your search or filters"
          />
        ) : (
          <Table headers={['User', 'Role', 'Contact', 'Status', 'Joined', 'Actions']}>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-white">{getRoleLabel(user.role)}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.phone && (
                      <div className="text-gray-400 flex items-center gap-1">
                        <Phone size={12} />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(user.status)} size="sm">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400 text-sm">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApprove(user.id)}
                          title="Approve"
                        >
                          <CheckCircle size={16} className="text-green-400" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(user.id)}
                          title="Reject"
                        >
                          <XCircle size={16} className="text-red-400" />
                        </Button>
                      </>
                    )}
                    {user.status === 'active' && user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSuspend(user.id)}
                        title="Suspend"
                      >
                        <Ban size={16} className="text-orange-400" />
                      </Button>
                    )}
                    {user.status === 'suspended' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleActivate(user.id)}
                        title="Activate"
                      >
                        <CheckCircle size={16} className="text-green-400" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      title="View Details"
                    >
                      <UserCog size={16} />
                    </Button>
                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(user.id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="User Details"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[#563EB7]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                <div className="mt-1">
                  <Badge variant={getStatusBadge(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <p className="text-white">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <p className="text-white">{getRoleLabel(selectedUser.role)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Joined</label>
                <p className="text-white">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
              </div>
              {selectedUser.approvedBy && (
                <>
                  <div>
                    <label className="text-sm text-gray-400">Approved By</label>
                    <p className="text-white">{selectedUser.approvedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Approved At</label>
                    <p className="text-white">
                      {selectedUser.approvedAt ? new Date(selectedUser.approvedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

