'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Campaign } from '@/types';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input, { Textarea } from '@/components/Input';
import Select from '@/components/Select';
import { Megaphone, DollarSign, Calendar, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type CampaignContentProps = {
  campaigns: Campaign[];
  projectId: string;
  onRefresh?: () => void;
};

export default function CampaignContent({ campaigns, projectId, onRefresh }: CampaignContentProps) {
  const { addCampaign, updateCampaign, deleteCampaign, users, activeUsers } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'facebook-ads' as Campaign['type'],
    objective: 'awareness' as Campaign['objective'],
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'planned' as Campaign['status'],
    responsiblePerson: activeUsers[0]?.id || users[0]?.id || '',
  });

  const handleAddCampaign = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await addCampaign({
        name: formData.name,
        projectId: String(projectId),
        type: formData.type,
        objective: formData.objective,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        status: formData.status,
        responsiblePerson: formData.responsiblePerson,
        createdBy: '1',
        progress: 0,
      });

      toast.success(`${formData.name} created! 🎉`, {
        description: 'Campaign has been added to the project',
      });

      setIsModalOpen(false);
      setFormData({
        name: '',
        type: 'facebook-ads',
        objective: 'awareness',
        startDate: '',
        endDate: '',
        budget: 0,
        status: 'planned',
        responsiblePerson: activeUsers[0]?.id || users[0]?.id || '',
      });
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to create campaign', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCampaign) return;

    if (!editingCampaign.name || !editingCampaign.startDate || !editingCampaign.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await updateCampaign(editingCampaign.id, {
        name: editingCampaign.name,
        type: editingCampaign.type,
        objective: editingCampaign.objective,
        startDate: editingCampaign.startDate,
        endDate: editingCampaign.endDate,
        budget: editingCampaign.budget,
        status: editingCampaign.status,
        responsiblePerson: editingCampaign.responsiblePerson,
      });

      toast.success('Campaign updated! ✅');
      setIsEditModalOpen(false);
      setEditingCampaign(null);
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to update campaign', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      await deleteCampaign(campaignId);
      toast.success(`${campaign?.name} deleted! 🗑️`);
      setDeleteConfirmId(null);
      
      // Refresh project data
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'completed': 'success',
      'running': 'info',
      'planned': 'default',
      'paused': 'warning',
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Campaigns</h2>
          <p className="text-sm text-gray-400">
            Track campaign performance and content readiness
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Create Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Megaphone size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No campaigns yet for this project</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} hover={true}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{campaign.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">
                      {campaign.type.replace('-', ' ')} • {campaign.objective}
                    </p>
                  </div>
                  <Badge variant={getStatusBadge(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Campaign Progress</span>
                    <span className="text-white font-semibold">{campaign.progress}%</span>
                  </div>
                  <ProgressBar progress={campaign.progress} size="md" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#1a1333] rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <DollarSign size={14} />
                      <span>Budget</span>
                    </div>
                    <p className="text-white font-bold">${campaign.budget.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-[#1a1333] rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Calendar size={14} />
                      <span>Duration</span>
                    </div>
                    <p className="text-white font-bold text-sm">
                      {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' - '}
                      {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* KPIs */}
                {campaign.kpis && campaign.kpis.length > 0 && (
                  <div className="border-t border-[#563EB7]/20 pt-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                      <TrendingUp size={14} />
                      <span>Key Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {campaign.kpis.slice(0, 4).map((kpi, index) => (
                        <div key={index} className="bg-[#563EB7]/10 rounded px-2 py-1">
                          <span className="text-xs text-gray-400">{kpi.name}:</span>
                          <span className="text-sm text-[#563EB7] font-semibold ml-1">{kpi.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-[#563EB7]/20 pt-4 flex items-center gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditCampaign(campaign)}
                    className="flex-1 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    <span className="text-sm font-medium">Edit</span>
                  </button>

                  {/* Delete Button */}
                  {deleteConfirmId === campaign.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="flex-1 py-2 px-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-2 px-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(campaign.id)}
                      className="flex-1 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCampaign}>
              Create Campaign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Campaign Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter campaign name"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Campaign Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Campaign['type'] })}
              options={[
                { value: 'facebook-ads', label: 'Facebook Ads' },
                { value: 'instagram-ads', label: 'Instagram Ads' },
                { value: 'google-ads', label: 'Google Ads' },
                { value: 'linkedin-ads', label: 'LinkedIn Ads' },
                { value: 'email-marketing', label: 'Email Marketing' },
                { value: 'offline-campaign', label: 'Offline Campaign' },
              ]}
            />

            <Select
              label="Objective"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value as Campaign['objective'] })}
              options={[
                { value: 'awareness', label: 'Awareness' },
                { value: 'engagement', label: 'Engagement' },
                { value: 'leads', label: 'Leads' },
                { value: 'sales', label: 'Sales' },
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
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget ($)"
              type="number"
              min="0"
              value={formData.budget.toString()}
              onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Campaign['status'] })}
              options={[
                { value: 'planned', label: 'Planned' },
                { value: 'running', label: 'Running' },
                { value: 'paused', label: 'Paused' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
          </div>

          <Select
            label="Responsible Person"
            value={formData.responsiblePerson}
            onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
            options={activeUsers.map(u => ({ value: u.id, label: u.name }))}
          />
        </div>
      </Modal>

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCampaign(null);
          }}
          title="Edit Campaign"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingCampaign(null);
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
              label="Campaign Name"
              value={editingCampaign.name}
              onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
              placeholder="Enter campaign name"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Campaign Type"
                value={editingCampaign.type}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, type: e.target.value as Campaign['type'] })}
                options={[
                  { value: 'facebook-ads', label: 'Facebook Ads' },
                  { value: 'instagram-ads', label: 'Instagram Ads' },
                  { value: 'google-ads', label: 'Google Ads' },
                  { value: 'linkedin-ads', label: 'LinkedIn Ads' },
                  { value: 'email-marketing', label: 'Email Marketing' },
                  { value: 'offline-campaign', label: 'Offline Campaign' },
                ]}
              />

              <Select
                label="Objective"
                value={editingCampaign.objective}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, objective: e.target.value as Campaign['objective'] })}
                options={[
                  { value: 'awareness', label: 'Awareness' },
                  { value: 'engagement', label: 'Engagement' },
                  { value: 'leads', label: 'Leads' },
                  { value: 'sales', label: 'Sales' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={editingCampaign.startDate}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={editingCampaign.endDate}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Budget ($)"
                type="number"
                min="0"
                value={editingCampaign.budget.toString()}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, budget: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />

              <Select
                label="Status"
                value={editingCampaign.status}
                onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as Campaign['status'] })}
                options={[
                  { value: 'planned', label: 'Planned' },
                  { value: 'running', label: 'Running' },
                  { value: 'paused', label: 'Paused' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
            </div>

            <Select
              label="Responsible Person"
              value={editingCampaign.responsiblePerson}
              onChange={(e) => setEditingCampaign({ ...editingCampaign, responsiblePerson: e.target.value })}
              options={activeUsers.map(u => ({ value: u.id, label: u.name }))}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

