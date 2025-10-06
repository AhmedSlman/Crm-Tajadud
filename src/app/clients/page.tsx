'use client';

import { useState, useMemo, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import LoadingState, { LoadingSpinner } from '@/components/LoadingState';
import { Plus, Pencil, Trash2, Mail, Phone, Building, Download, Users as UsersIcon, UserPlus, Key } from 'lucide-react';
import { Client, ClientUser } from '@/types';
import { exportToCSV, searchInObject } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, projects, loading, currentUser, canPerformAction } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientUsers, setClientUsers] = useState<Array<{ id: string; name: string; email: string; phone?: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  
  // Local state for optimistic updates
  const [localClients, setLocalClients] = useState<Client[]>(clients);
  
  // Update local clients when props change
  useEffect(() => {
    setLocalClients(clients);
  }, [clients]);
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
  });

  // Open Client Users Modal
  const handleOpenUsersModal = async (client: Client) => {
    setSelectedClient(client);
    setIsUsersModalOpen(true);
    setLoadingUsers(true);
    
    try {
      const users = await api.clients.getUsers(client.id);
      setClientUsers(users);
    } catch (error) {
      console.error('Error loading client users:', error);
      toast.error('Failed to load client users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open Add User Modal
  const handleOpenAddUserModal = () => {
    setUserFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
    });
    setIsAddUserModalOpen(true);
  };

  // Create Client User
  const handleCreateUser = async () => {
    if (!userFormData.name || !userFormData.email || !userFormData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const result = await api.clients.createUser(selectedClient!.id, userFormData);
      toast.success('Client user created successfully! 🎉', {
        description: `Login: ${(result as ClientUser & { login_credentials?: { email: string } }).login_credentials?.email || userFormData.email}`,
      });
      setIsAddUserModalOpen(false);
      // Refresh users list
      handleOpenUsersModal(selectedClient!);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Client User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? They will lose access to the portal.')) {
      return;
    }

    try {
      await api.clients.deleteUser(selectedClient!.id, userId);
      toast.success('User deleted successfully');
      setClientUsers(clientUsers.filter(u => u.id !== userId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        contactPerson: client.contactPerson,
        phone: client.phone,
        email: client.email,
        company: client.company,
        notes: client.notes,
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        company: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    
    if (editingClient) {
      // Optimistic update for edit
      const updatedClients = localClients.map(c =>
        c.id === editingClient.id ? { ...c, ...formData } : c
      );
      setLocalClients(updatedClients);
      toast.success(`${formData.name} updated successfully! ✅`);
      setIsModalOpen(false);
      setSubmitting(false);
      
      // Update in backend
      try {
        await updateClient(editingClient.id, formData);
      } catch (error) {
        setLocalClients(clients); // revert
        toast.error('Failed to save client', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      }
    } else {
      // For new client, wait for backend (to get real ID)
      try {
        const newClient: Client = {
          id: Date.now().toString(),
          ...formData,
          linkedProjects: [],
          createdAt: new Date().toISOString(),
        };
        await addClient(newClient);
        toast.success(`${formData.name} added successfully! 🎉`);
        setIsModalOpen(false);
      } catch (error) {
        toast.error('Failed to save client', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const client = localClients.find(c => c.id === id);
    if (confirm(`Are you sure you want to delete ${client?.name}?`)) {
      // Optimistic delete
      const updatedClients = localClients.filter(c => c.id !== id);
      setLocalClients(updatedClients);
      toast.success(`${client?.name} deleted successfully! 🗑️`);
      
      // Delete in backend
      try {
        await deleteClient(id);
      } catch (error) {
        setLocalClients(clients); // revert
        toast.error('Failed to delete client');
      }
    }
  };

  const getClientProjects = (clientId: string) => {
    return projects.filter(p => p.clientId === clientId);
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    return clients.filter(client => searchInObject(client, searchQuery));
  }, [clients, searchQuery]);

  const handleExport = () => {
    const exportData = clients.map(client => ({
      Name: client.name,
      'Contact Person': client.contactPerson,
      Phone: client.phone,
      Email: client.email,
      Company: client.company,
      'Total Projects': getClientProjects(client.id).length,
      Notes: client.notes,
      'Created At': client.createdAt,
    }));
    exportToCSV(exportData, 'clients');
    toast.success(`Exported ${exportData.length} clients! 📊`, {
      description: 'File downloaded successfully',
    });
  };

  // Show loading state
  if (loading) {
    return (
      <LoadingState 
        title="Clients"
        subtitle="Manage your client relationships"
        message="Loading clients..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Clients
          </h1>
          <p className="text-gray-400 text-lg">Manage your client relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download size={20} className="mr-2" />
            Export
          </Button>
          {canPerformAction(currentUser?.role, 'clients', 'create') && (
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Add Client
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search clients by name, email, company..."
        onSearch={setSearchQuery}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-[#563EB7] mb-2">{clients.length}</div>
            <p className="text-sm text-gray-400">Total Clients</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{projects.length}</div>
            <p className="text-sm text-gray-400">Total Projects</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {projects.filter(p => p.status === 'in-progress').length}
            </div>
            <p className="text-sm text-gray-400">Active Projects</p>
          </div>
        </Card>
      </div>

      <Card>
        {filteredClients.length === 0 ? (
          <EmptyState
            icon={<UsersIcon size={48} className="text-[#563EB7]" />}
            title={searchQuery ? 'No clients found' : 'No clients yet'}
            description={searchQuery ? 'Try adjusting your search query' : 'Add your first client to get started'}
            actionLabel={searchQuery ? undefined : 'Add Your First Client'}
            onAction={searchQuery ? undefined : () => handleOpenModal()}
          />
        ) : (
          <Table headers={['Client', 'Contact', 'Company', 'Projects', 'Actions']}>
            {filteredClients.filter(client => client && client.id).map((client) => {
              const clientProjects = getClientProjects(client.id);
              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-white">{client.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Mail size={12} />
                        {client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white">{client.contactPerson}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-gray-400" />
                      <span className="text-white">{client.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[#563EB7] font-semibold">
                      {clientProjects.length} {clientProjects.length === 1 ? 'project' : 'projects'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenUsersModal(client)}
                        title="Manage Portal Users"
                      >
                        <Key size={16} className="text-blue-400" />
                      </Button>
                      {canPerformAction(currentUser?.role, 'clients', 'update') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenModal(client)}
                        >
                          <Pencil size={16} />
                        </Button>
                      )}
                      {canPerformAction(currentUser?.role, 'clients', 'delete') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 size={16} className="text-red-400" />
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
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
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
                  {editingClient ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingClient ? 'Update' : 'Create'
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Client Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter client name"
          />
          <Input
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="Enter contact person"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
          </div>
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Enter company name"
          />
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about the client..."
            rows={4}
          />
        </div>
      </Modal>

      {/* Client Users Modal */}
      <Modal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
        title={`Portal Users - ${selectedClient?.name}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              Manage login accounts for {selectedClient?.company}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddUserModal}
            >
              <UserPlus size={16} className="mr-2" />
              Add User
            </Button>
          </div>

          {loadingUsers ? (
            <div className="text-center py-8">
              <LoadingSpinner />
            </div>
          ) : clientUsers.length === 0 ? (
            <div className="text-center py-8">
              <Key size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Portal Users</h3>
              <p className="text-gray-400 mb-4">
                Create a login account for this client to access their projects
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-[#1a1333] rounded-lg border border-[#563EB7]/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-full flex items-center justify-center">
                      <UsersIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Phone size={12} />
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Add Client User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Create Portal Login"
      >
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
            <p className="text-blue-300 text-sm">
              🔐 This will create a login account for the client to access their projects via the Client Portal
            </p>
          </div>

          <Input
            label="Name *"
            value={userFormData.name}
            onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
            placeholder="Enter full name"
          />
          <Input
            label="Email *"
            type="email"
            value={userFormData.email}
            onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
            placeholder="user@example.com"
          />
          <Input
            label="Password *"
            type="password"
            value={userFormData.password}
            onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
            placeholder="Minimum 6 characters"
          />
          <Input
            label="Phone (Optional)"
            value={userFormData.phone}
            onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
            placeholder="+1 234 567 8900"
          />

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ Make sure to share the login credentials with the client securely
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsAddUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateUser}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

