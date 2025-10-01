'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Table, { TableRow, TableCell } from '@/components/Table';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import { Plus, Pencil, Trash2, Mail, Phone, Building } from 'lucide-react';
import { Client } from '@/types';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, projects } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-gray-400">Manage your client relationships</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Add Client
        </Button>
      </div>

      <Card>
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No clients yet</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Add Your First Client
            </Button>
          </div>
        ) : (
          <Table headers={['Client', 'Contact', 'Company', 'Projects', 'Actions']}>
            {clients.map((client) => {
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

