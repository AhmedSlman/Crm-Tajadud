'use client';

import { Project, Task, Campaign, Content } from '@/types';
import { CheckCircle, Megaphone, FileText, Video, TrendingUp } from 'lucide-react';

type ProjectStatsProps = {
  project: Project;
  tasks: Task[];
  campaigns: Campaign[];
  content: Content[];
};

export default function ProjectStats({ project, tasks, campaigns, content }: ProjectStatsProps) {
  // Calculate stats
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
  
  const regularContent = content.filter(c => !c.isReel);
  const completedContent = regularContent.filter(c => c.status === 'published' || c.status === 'approved').length;
  const contentProgress = regularContent.length > 0 
    ? Math.round((completedContent / regularContent.length) * 100) 
    : 0;

  const reels = content.filter(c => c.isReel);
  const completedReels = reels.filter(c => c.status === 'published' || c.status === 'approved').length;
  const reelsProgress = reels.length > 0 
    ? Math.round((completedReels / reels.length) * 100) 
    : 0;

  const stats = [
    {
      label: 'Tasks Completed',
      value: `${completedTasks}/${totalTasks}`,
      percentage: taskCompletionRate,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns,
      icon: Megaphone,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400'
    },
    {
      label: 'Content Ready',
      value: `${completedContent}/${regularContent.length}`,
      percentage: contentProgress,
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      label: 'Reels Ready',
      value: `${completedReels}/${reels.length}`,
      percentage: reelsProgress,
      icon: Video,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      label: 'Project Progress',
      value: `${project.progress}%`,
      percentage: project.progress,
      icon: TrendingUp,
      color: 'from-[#563EB7] to-[#7c5fdc]',
      bgColor: 'bg-[#563EB7]/10',
      textColor: 'text-[#563EB7]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.label}
            className="relative bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-xl p-5 overflow-hidden group hover:border-[#563EB7]/40 transition-all duration-300 hover:scale-105 animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <Icon className={stat.textColor} size={20} />
                </div>
                {stat.percentage !== undefined && (
                  <span className={`text-sm font-bold ${stat.textColor}`}>
                    {stat.percentage}%
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
              </div>

              {/* Progress bar */}
              {stat.percentage !== undefined && (
                <div className="mt-3 h-1.5 bg-[#1a1333] rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

