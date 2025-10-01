'use client';

import { useState, use } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import { 
  Calendar, 
  ChevronLeft, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  Video
} from 'lucide-react';
import Link from 'next/link';

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
  const { projects, tasks, campaigns, content } = useData();
  const { user } = useAuth();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  // Find the project
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
        <Link href="/projects">
          <Button variant="secondary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  // Filter data by project and month
  const monthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const projectCampaigns = campaigns.filter(c => c.projectId === projectId);
  const projectContent = content.filter(c => c.projectId === projectId);
  
  const monthTasks = projectTasks.filter(t => {
    const taskMonth = t.dueDate.substring(0, 7);
    return taskMonth === monthKey;
  });

  const monthContent = projectContent.filter(c => c.month === monthKey);
  const monthReels = monthContent.filter(c => c.isReel === true);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-gray-400 mt-1">{project.description}</p>
          </div>
        </div>
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
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
          />
        )}
        
        {activeTab === 'content-plan' && (
          <ContentPlanTable 
            content={monthRegularContent}
            projectId={projectId}
            month={monthKey}
            userRole={user?.role || 'admin'}
          />
        )}
        
        {activeTab === 'reels-plan' && (
          <ReelsPlanTable 
            reels={monthReels}
            projectId={projectId}
            month={monthKey}
            userRole={user?.role || 'admin'}
          />
        )}
        
        {activeTab === 'campaigns' && (
          <CampaignContent 
            campaigns={projectCampaigns}
            projectId={projectId}
          />
        )}
        
        {activeTab === 'social-calendar' && (
          <SocialCalendarView 
            month={selectedMonth}
            projectId={projectId}
          />
        )}
      </div>
    </div>
  );
}
