'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import ClientProtectedRoute from '@/components/ClientProtectedRoute';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  TrendingUp,
  Eye,
  ExternalLink,
  FileText,
  Video,
  Image,
  BarChart3
} from 'lucide-react';
import { ClientUser, Project, Task, Content, Campaign } from '@/types';
import api from '@/lib/api';
import { getAvatarUrl } from '@/lib/config';

export default function ClientProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [project, setProject] = useState<any>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectContent, setProjectContent] = useState<Content[]>([]);
  const [projectCampaigns, setProjectCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'campaigns' | 'timeline'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get client user from localStorage (already validated by ClientProtectedRoute)
    const storedClient = localStorage.getItem('clientUser');
    if (storedClient) {
      const client = JSON.parse(storedClient);
      setClientUser(client);
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // جلب بيانات المشروع من الخادم
      const projectData = await api.clientPortal.getProject(projectId);
      
      setProject(projectData);
      setProjectTasks(projectData.tasks || []);
      setProjectContent(projectData.contents || []);
      setProjectCampaigns(projectData.campaigns || []);
      
    } catch (error) {
      console.error('Error loading project:', error);
      // إذا فشل التحميل أو المشروع غير موجود، ارجع للـ dashboard
      router.push('/client-dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ClientProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
          <div className="text-white text-xl">Loading project...</div>
        </div>
      </ClientProtectedRoute>
    );
  }

  if (!clientUser || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const completedTasks = projectTasks.filter(t => t.status === 'done').length;
  const publishedContent = projectContent.filter(c => c.status === 'published').length;
  const activeCampaigns = projectCampaigns.filter(c => c.status === 'running').length;
  const projectManager = project.projectManager || project.project_manager;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'done': return 'success';
      case 'published': return 'success';
      case 'running': return 'success';
      case 'in-progress': return 'warning';
      case 'review': return 'warning';
      case 'planned': return 'info';
      case 'idea': return 'info';
      case 'on-hold': return 'default';
      case 'paused': return 'default';
      default: return 'default';
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="text-purple-400" size={16} />;
      case 'image': return <Image className="text-green-400" size={16} />;
      default: return <FileText className="text-blue-400" size={16} />;
    }
  };

  return (
    <ClientProtectedRoute>
      <div className="min-h-screen bg-[#0c081e] text-white">
      {/* Header */}
      <div className="bg-[#14102a] border-b border-[#563EB7]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/client-dashboard')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
              <p className="text-sm text-gray-400">{clientUser.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor(project.status)}>
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Project Header */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-[#563EB7]/20 to-[#8B5CF6]/20 border border-[#563EB7]/30 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
              <p className="text-gray-300 mb-4">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="text-white font-medium">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">End Date</p>
                  <p className="text-white font-medium">
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Overall Progress</span>
                  <span className="text-lg font-bold text-white">{project.progress}%</span>
                </div>
                <ProgressBar progress={project.progress} />
              </div>
              
              {projectManager && (
                <div className="bg-[#1a1333] rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Project Manager</p>
                  <div className="flex items-center gap-3">
                    {projectManager.avatar ? (
                      <img
                        src={getAvatarUrl(projectManager.avatar)}
                        alt={projectManager.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-full flex items-center justify-center">
                        <Users size={16} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{projectManager.name}</p>
                      <p className="text-xs text-gray-400">{projectManager.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">
                  {projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0}%
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">Tasks Completed</h3>
              <p className="text-sm text-gray-400">
                {completedTasks} of {projectTasks.length} tasks
              </p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="text-orange-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{publishedContent}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Published Content</h3>
              <p className="text-sm text-gray-400">
                {publishedContent} of {projectContent.length} pieces
              </p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Target className="text-purple-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{activeCampaigns}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Active Campaigns</h3>
              <p className="text-sm text-gray-400">Currently running</p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="text-blue-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">
                  {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">Days Remaining</h3>
              <p className="text-sm text-gray-400">Until project deadline</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-[#1a1333] p-1 rounded-xl">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'campaigns', label: 'Campaigns', icon: Target },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'content' | 'campaigns' | 'timeline')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#563EB7] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#563EB7]/20'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <Card title="Recent Tasks">
              <div className="divide-y divide-[#563EB7]/10">
                {projectTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-400">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(task.status)} size="sm">
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
                {projectTasks.length === 0 && (
                  <div className="p-4 text-center text-gray-400">
                    No tasks available
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Content */}
            <Card title="Recent Content">
              <div className="divide-y divide-[#563EB7]/10">
                {projectContent.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getContentIcon(item.contentType)}
                      <div>
                        <h4 className="font-medium text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400 capitalize">{item.contentType}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                ))}
                {projectContent.length === 0 && (
                  <div className="p-4 text-center text-gray-400">
                    No content available
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <Card title="All Content">
            <div className="divide-y divide-[#563EB7]/10">
              {projectContent.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getContentIcon(item.contentType)}
                      <div>
                        <h4 className="font-medium text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400 capitalize">{item.contentType}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Priority</p>
                      <p className="text-white capitalize">{item.priority}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Due Date</p>
                      <p className="text-white">
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Progress</p>
                      <p className="text-white">{item.progress}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-white">{item.isReel ? 'Reel' : 'Post'}</p>
                    </div>
                  </div>
                </div>
              ))}
              {projectContent.length === 0 && (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No content available for this project</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'campaigns' && (
          <Card title="All Campaigns">
            <div className="divide-y divide-[#563EB7]/10">
              {projectCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white mb-1">{campaign.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{campaign.type} • {campaign.objective}</p>
                    </div>
                    <Badge variant={getStatusColor(campaign.status)} size="sm">
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Start Date</p>
                      <p className="text-white">{new Date(campaign.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">End Date</p>
                      <p className="text-white">{new Date(campaign.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Budget</p>
                      <p className="text-white">${campaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Progress</p>
                      <p className="text-white">{campaign.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
              {projectCampaigns.length === 0 && (
                <div className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No campaigns available for this project</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'timeline' && (
          <Card title="Project Timeline">
            <div className="space-y-4">
              {/* Combine and sort all activities */}
              {[
                ...projectTasks.map(t => ({ ...t, type: 'task', date: t.dueDate || t.createdAt })),
                ...projectContent.map(c => ({ ...c, type: 'content', date: c.dueDate || c.createdAt })),
                ...projectCampaigns.map(c => ({ ...c, type: 'campaign', date: c.startDate })),
              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-start gap-4 p-4 bg-[#1a1333]/50 rounded-lg">
                    <div className="w-2 h-2 bg-[#563EB7] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">
                          {'title' in item ? item.title : 'name' in item ? item.name : 'Unknown'}
                        </h4>
                        <Badge variant={getStatusColor(item.status)} size="sm">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              {projectTasks.length === 0 && projectContent.length === 0 && projectCampaigns.length === 0 && (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No timeline activities available</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
    </ClientProtectedRoute>
  );
}
