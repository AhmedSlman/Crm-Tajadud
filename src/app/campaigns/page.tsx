'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import LoadingState, { LoadingSpinner } from '@/components/LoadingState';
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { Campaign } from '@/types';
import { toast } from 'sonner';

export default function CampaignsPage() {
  const { campaigns, projects, users, activeUsers, addCampaign, updateCampaign, deleteCampaign, loading } = useData();
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(campaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Sync with global campaigns
  useEffect(() => {
    setLocalCampaigns(campaigns);
  }, [campaigns]);
  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    type: 'facebook-ads' as Campaign['type'],
    objective: 'awareness' as Campaign['objective'],
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'planned' as Campaign['status'],
    responsiblePerson: '',
    progress: 0,
  });

  const handleOpenModal = (campaign?: Campaign) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        name: campaign.name,
        projectId: campaign.projectId,
        type: campaign.type,
        objective: campaign.objective,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        budget: campaign.budget,
        status: campaign.status,
        responsiblePerson: campaign.responsiblePerson,
        progress: campaign.progress,
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        name: '',
        projectId: projects[0]?.id || '',
        type: 'facebook-ads',
        objective: 'awareness',
        startDate: '',
        endDate: '',
        budget: 0,
        status: 'planned',
        responsiblePerson: users[0]?.id || '',
        progress: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.projectId) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, formData);
        toast.success(`${formData.name} updated successfully! ✅`);
      } else {
        const newCampaign: Campaign = {
          id: Date.now().toString(),
          ...formData,
          createdBy: '1',
          kpis: [],
          attachments: [],
          createdAt: new Date().toISOString(),
        };
        await addCampaign(newCampaign);
        toast.success(`${formData.name} created successfully! 🎉`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save campaign', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
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

  const getCampaignTypeIcon = (type: string) => {
    return type.replace('-', ' ').replace('ads', '').trim();
  };

  // Show loading state
  if (loading) {
    return (
      <LoadingState 
        title="Campaigns"
        subtitle="Manage your marketing campaigns"
        message="Loading campaigns..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-gray-400">Manage your marketing campaigns</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          const project = projects.find(p => p.id === campaign.projectId);
          
          return (
            <Card key={campaign.id}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                    <p className="text-sm text-gray-400">{project?.name}</p>
                  </div>
                  <Badge variant={getStatusBadge(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white font-medium capitalize">{getCampaignTypeIcon(campaign.type)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Objective</span>
                    <Badge variant="primary" size="sm">{campaign.objective}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Budget</span>
                    <span className="text-[#563EB7] font-semibold flex items-center gap-1">
                      <DollarSign size={14} />
                      {campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white text-xs">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <ProgressBar progress={campaign.progress} showLabel size="md" className="mb-4" />

                {campaign.kpis && campaign.kpis.length > 0 && (
                  <div className="mb-4 p-3 bg-[#1a1333] rounded-lg">
                    <div className="text-xs text-gray-400 mb-2">KPIs</div>
                    <div className="grid grid-cols-2 gap-2">
                      {campaign.kpis.slice(0, 4).map((kpi, index) => (
                        <div key={index} className="text-xs">
                          <div className="text-gray-400">{kpi.name}</div>
                          <div className="text-white font-semibold">{kpi.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleOpenModal(campaign)} className="flex-1">
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(campaign.id)}>
                    <Trash2 size={14} className="text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No campaigns yet</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={20} className="mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingCampaign ? 'Edit Campaign' : 'New Campaign'}
        size="lg"
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
                  {editingCampaign ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingCampaign ? 'Update' : 'Create'
              )}
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
          />
          <Select
            label="Project"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            options={projects.map(p => ({ value: p.id, label: p.name }))}
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
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget ($)"
              type="number"
              min="0"
              value={formData.budget.toString()}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
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
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Responsible Person"
              value={formData.responsiblePerson}
              onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
              options={activeUsers.map(u => ({ value: u.id, label: u.name }))}
            />
            <Input
              label="Progress (%)"
              type="number"
              min="0"
              max="100"
              value={formData.progress.toString()}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

