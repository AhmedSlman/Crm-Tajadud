'use client';

import { Campaign } from '@/types';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import { Megaphone, DollarSign, Calendar, TrendingUp } from 'lucide-react';

type CampaignContentProps = {
  campaigns: Campaign[];
  projectId: string;
};

export default function CampaignContent({ campaigns }: CampaignContentProps) {
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
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Campaigns</h2>
        <p className="text-sm text-gray-400">
          Track campaign performance and content readiness
        </p>
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
                  <div className="border-t border-[#563EB7]/20 pt-4">
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
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

