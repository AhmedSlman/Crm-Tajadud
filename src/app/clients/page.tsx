'use client';

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { Plus, Pencil, Trash2, Mail, Phone, Building, Download, Users as UsersIcon } from 'lucide-react';
import { Client } from '@/types';
import { exportToCSV, searchInObject } from '@/lib/utils';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, projects } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
  });

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

  const handleSubmit = () => {
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        linkedProjects: [],
        createdAt: new Date().toISOString(),
      };
      addClient(newClient);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
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
  };

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
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Add Client
          </Button>
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
                        onClick={() => handleOpenModal(client)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
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
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingClient ? 'Update' : 'Create'}
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
    </div>
  );
}

