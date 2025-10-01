'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Select from '@/components/Select';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  Target,
  FileText
} from 'lucide-react';

export default function ReportsPage() {
  const { projects, tasks, campaigns, content, clients, users } = useData();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (selectedClient !== 'all') {
      filtered = filtered.filter(p => p.clientId === selectedClient);
    }
    if (selectedProject !== 'all') {
      filtered = filtered.filter(p => p.id === selectedProject);
    }
    return filtered;
  }, [projects, selectedClient, selectedProject]);

  const filteredTasks = useMemo(() => {
    if (selectedProject === 'all') return tasks;
    return tasks.filter(t => t.projectId === selectedProject);
  }, [tasks, selectedProject]);

  const filteredCampaigns = useMemo(() => {
    if (selectedProject === 'all') return campaigns;
    return campaigns.filter(c => c.projectId === selectedProject);
  }, [campaigns, selectedProject]);

  const filteredContent = useMemo(() => {
    if (selectedProject === 'all') return content;
    return content.filter(c => c.projectId === selectedProject);
  }, [content, selectedProject]);

  // Task Statistics
  const taskStats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter(t => t.status === 'done').length,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
    overdue: filteredTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date() && t.status !== 'done';
    }).length,
    delayed: filteredTasks.filter(t => t.status === 'delayed').length,
  };

  // Campaign Statistics
  const campaignStats = {
    total: filteredCampaigns.length,
    running: filteredCampaigns.filter(c => c.status === 'running').length,
    completed: filteredCampaigns.filter(c => c.status === 'completed').length,
    totalBudget: filteredCampaigns.reduce((sum, c) => sum + c.budget, 0),
  };

  // Content Statistics
  const contentStats = {
    total: filteredContent.length,
    published: filteredContent.filter(c => c.status === 'published').length,
    scheduled: filteredContent.filter(c => c.status === 'scheduled').length,
    inProgress: filteredContent.filter(c => c.status === 'in-progress').length,
    pending: filteredContent.filter(c => ['idea', 'review', 'approved'].includes(c.status)).length,
  };

  // Team Workload
  const teamWorkload = useMemo(() => {
    const workload = users.map(user => {
      const userTasks = filteredTasks.filter(t => t.assignedTo === user.id);
      const userContent = filteredContent.filter(c => c.assignedTo === user.id);
      
      return {
        user,
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(t => t.status === 'done').length,
        activeTasks: userTasks.filter(t => t.status !== 'done').length,
        totalContent: userContent.length,
        completedContent: userContent.filter(c => c.status === 'published').length,
      };
    });
    
    return workload;
  }, [users, filteredTasks, filteredContent]);

  const statCards = [
    {
      title: 'Active Projects',
      value: filteredProjects.filter(p => p.status === 'in-progress').length,
      total: filteredProjects.length,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Tasks Completed',
      value: taskStats.completed,
      total: taskStats.total,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Running Campaigns',
      value: campaignStats.running,
      total: campaignStats.total,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Published Content',
      value: contentStats.published,
      total: contentStats.total,
      icon: FileText,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Track performance and monitor KPIs</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 flex items-center gap-4">
          <span className="text-gray-400">Filter by:</span>
          <Select
            value={selectedClient}
            onChange={(e) => {
              setSelectedClient(e.target.value);
              setSelectedProject('all');
            }}
            options={[
              { value: 'all', label: 'All Clients' },
              ...clients.map(c => ({ value: c.id, label: c.name }))
            ]}
            className="w-48"
          />
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={[
              { value: 'all', label: 'All Projects' },
              ...(selectedClient === 'all' 
                ? projects 
                : projects.filter(p => p.clientId === selectedClient)
              ).map(p => ({ value: p.id, label: p.name }))
            ]}
            className="w-48"
          />
        </div>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const percentage = stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;
          
          return (
            <Card key={stat.title}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <h3 className="text-sm text-gray-400 mb-1">{stat.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">of {stat.total} total</span>
                  <span className={`font-semibold ${percentage >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Breakdown */}
        <Card title="Task Status Breakdown">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-white">Completed</span>
              </div>
              <span className="text-xl font-bold text-white">{taskStats.completed}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-400" />
                <span className="text-white">In Progress</span>
              </div>
              <span className="text-xl font-bold text-white">{taskStats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown size={20} className="text-yellow-400" />
                <span className="text-white">Overdue</span>
              </div>
              <span className="text-xl font-bold text-white">{taskStats.overdue}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-red-400" />
                <span className="text-white">Delayed</span>
              </div>
              <span className="text-xl font-bold text-white">{taskStats.delayed}</span>
            </div>
          </div>
        </Card>

        {/* Campaign Performance */}
        <Card title="Campaign Performance">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <span className="text-gray-400">Total Campaigns</span>
              <span className="text-xl font-bold text-white">{campaignStats.total}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <span className="text-gray-400">Running</span>
              <Badge variant="info">{campaignStats.running}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <span className="text-gray-400">Completed</span>
              <Badge variant="success">{campaignStats.completed}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1333] rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-[#563EB7]" />
                <span className="text-gray-400">Total Budget</span>
              </div>
              <span className="text-xl font-bold text-[#563EB7]">
                ${campaignStats.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Overview */}
      <Card title="Content Status Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-[#1a1333] rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">{contentStats.published}</div>
            <div className="text-sm text-gray-400">Published</div>
          </div>
          <div className="text-center p-4 bg-[#1a1333] rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">{contentStats.scheduled}</div>
            <div className="text-sm text-gray-400">Scheduled</div>
          </div>
          <div className="text-center p-4 bg-[#1a1333] rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">{contentStats.inProgress}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div className="text-center p-4 bg-[#1a1333] rounded-lg">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{contentStats.pending}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
        </div>
      </Card>

      {/* Team Workload */}
      <Card title="Team Workload Distribution">
        <div className="space-y-4">
          {teamWorkload.map((member) => (
            <div key={member.user.id} className="p-4 bg-[#1a1333] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full flex items-center justify-center overflow-hidden">
                    {member.user.avatar ? (
                      <Image src={member.user.avatar} alt={member.user.name} width={40} height={40} className="rounded-full" />
                    ) : (
                      <Users size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{member.user.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{member.user.role.replace('-', ' ')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Active Tasks</div>
                  <div className="text-xl font-bold text-white">{member.activeTasks}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Total Tasks</div>
                  <div className="text-white font-semibold">{member.totalTasks}</div>
                </div>
                <div>
                  <div className="text-gray-400">Completed</div>
                  <div className="text-green-400 font-semibold">{member.completedTasks}</div>
                </div>
                <div>
                  <div className="text-gray-400">Content Items</div>
                  <div className="text-[#563EB7] font-semibold">{member.totalContent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Project Progress */}
      {filteredProjects.length > 0 && (
        <Card title="Project Progress Overview">
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-4 bg-[#1a1333] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{project.name}</h4>
                    <p className="text-sm text-gray-400">{clients.find(c => c.id === project.clientId)?.name}</p>
                  </div>
                  <Badge variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'info' : 'default'}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                </div>
                <ProgressBar progress={project.progress} showLabel size="md" />
                <div className="mt-2 text-xs text-gray-400">
                  Due: {new Date(project.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

