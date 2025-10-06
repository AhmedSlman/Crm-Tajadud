'use client';

import { useState, use, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import LoadingState from '@/components/LoadingState';
import api from '@/lib/api';
import { Task, Campaign, Content } from '@/types';
import { 
  Calendar, 
  ChevronLeft, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  Video
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Sub-components imports (will create them)
import ProjectStats from '@/components/project/ProjectStats';
import TasksKanban from '@/components/project/TasksKanban';
import ContentPlanTable from '@/components/project/ContentPlanTable';
import ReelsPlanTable from '@/components/project/ReelsPlanTable';
import CampaignContent from '@/components/project/CampaignContent';
import SocialCalendarView from '@/components/project/SocialCalendarView';
import MonthSelector from '@/components/MonthSelector';

type TabType = 'tasks' | 'content-plan' | 'reels-plan' | 'campaigns' | 'social-calendar';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <ProtectedRoute>
      <ProjectDetailContent projectId={resolvedParams.id} />
    </ProtectedRoute>
  );
}

function ProjectDetailContent({ projectId }: { projectId: string }) {
  const { projects, loading: globalLoading } = useData();
  const { user } = useAuth();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  
  // Project-specific data
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectCampaigns, setProjectCampaigns] = useState<Campaign[]>([]);
  const [projectContent, setProjectContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch project-specific data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch all project data in parallel
        const [tasksData, campaignsData, contentData] = await Promise.all([
          api.tasks.getProjectTasks(projectId),
          api.campaigns.getProjectCampaigns(projectId),
          api.contents.getProjectContents(projectId),
        ]);
        
        setProjectTasks(tasksData);
        setProjectCampaigns(campaignsData);
        setProjectContent(contentData);
      } catch (error) {
        console.error('Failed to fetch project data:', error);
        toast.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, refreshKey]);

  // Refresh function to be called after CRUD operations
  const refreshProjectData = () => {
    setRefreshKey(prev => prev + 1);
  };

  
  // Show loading state
  if (loading || globalLoading) {
    return (
      <LoadingState 
        title="Project Details"
        subtitle="Loading project information..."
        message="Please wait..."
      />
    );
  }

  // Find the project (handle both string and number IDs)
  const project = projects.find(p => String(p.id) === String(projectId));

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
        <p className="text-gray-400 mb-6">
          The project you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link href="/projects">
          <Button variant="secondary">
            <ChevronLeft size={16} className="mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  // Filter data by month
  const monthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  
  const monthTasks = projectTasks.filter(t => {
    const taskMonth = t.dueDate?.substring(0, 7);
    return taskMonth === monthKey;
  });

  const monthContent = projectContent.filter(c => c.month === monthKey);
  const monthReels = monthContent.filter(c => !!c.isReel);
  const monthRegularContent = monthContent.filter(c => !c.isReel);

  // Tabs configuration
  const tabs = [
    { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare, count: monthTasks.length },
    { id: 'content-plan' as TabType, label: 'Content Plan', icon: FileText, count: monthRegularContent.length },
    { id: 'reels-plan' as TabType, label: 'Reels Plan', icon: Video, count: monthReels.length },
    { id: 'campaigns' as TabType, label: 'Campaigns', icon: Megaphone, count: projectCampaigns.length },
    { id: 'social-calendar' as TabType, label: 'Social Calendar', icon: Calendar, count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">{project.name}</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">{project.description}</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </div>
      </div>

      {/* Project Stats */}
      <ProjectStats 
        project={project}
        tasks={monthTasks}
        campaigns={projectCampaigns}
        content={monthContent}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-gradient-to-r from-[#563EB7] to-[#6d4dd4] text-white shadow-lg shadow-[#563EB7]/40' 
                  : 'bg-[#1a1333] text-gray-400 hover:text-white hover:bg-[#241a47]'
                }
              `}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isActive ? 'bg-white/20' : 'bg-[#563EB7]/20 text-[#563EB7]'}
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'tasks' && (
          <TasksKanban 
            tasks={projectTasks} 
            projectId={projectId}
            month={monthKey}
            onRefresh={refreshProjectData}
          />
        )}
        
        {activeTab === 'content-plan' && (
          <ContentPlanTable 
            content={monthRegularContent}
            projectId={projectId}
            month={monthKey}
            userRole={user?.role || 'admin'}
            onRefresh={refreshProjectData}
          />
        )}
        
        {activeTab === 'reels-plan' && (
          <ReelsPlanTable 
            reels={monthReels}
            projectId={projectId}
            month={monthKey}
            userRole={user?.role || 'admin'}
            onRefresh={refreshProjectData}
          />
        )}
        
        {activeTab === 'campaigns' && (
          <CampaignContent 
            campaigns={projectCampaigns}
            projectId={projectId}
            onRefresh={refreshProjectData}
          />
        )}
        
        {activeTab === 'social-calendar' && (
          <SocialCalendarView 
            month={selectedMonth}
            projectId={projectId}
            content={projectContent}
            onRefresh={refreshProjectData}
          />
        )}
      </div>
    </div>
  );
}
