'use client';

import { useData } from '@/context/DataContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import Image from 'next/image';
import StockPattern from '@/assets/stock.svg';
import { Users, FolderKanban, CheckSquare, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { clients, projects, tasks, campaigns, content } = useData();

  const stats = [
    { 
      name: 'Total Clients', 
      value: clients.length, 
      icon: Users, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      link: '/clients'
    },
    { 
      name: 'Active Projects', 
      value: projects.filter(p => p.status === 'in-progress').length, 
      icon: FolderKanban, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      link: '/projects'
    },
    { 
      name: 'Pending Tasks', 
      value: tasks.filter(t => t.status !== 'done').length, 
      icon: CheckSquare, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      link: '/tasks'
    },
    { 
      name: 'Running Campaigns', 
      value: campaigns.filter(c => c.status === 'running').length, 
      icon: Megaphone, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      link: '/campaigns'
    },
  ];

  const recentTasks = tasks.slice(0, 5);
  const activeProjects = projects.filter(p => p.status === 'in-progress').slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
      'done': 'success',
      'completed': 'success',
      'in-progress': 'info',
      'running': 'info',
      'review': 'warning',
      'planned': 'default',
      'to-do': 'default',
      'delayed': 'danger',
      'on-hold': 'warning',
    };
    return statusMap[status] || 'default';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
      'urgent': 'danger',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return priorityMap[priority] || 'default';
  };

  return (
    <div className="space-y-6 relative">
      {/* Header with gradient */}
      <div className="relative z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#563EB7]/20 via-[#7c5fdc]/20 to-[#563EB7]/20 blur-3xl -z-10" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.link} className="block group">
              <div 
                className="relative bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/20 rounded-xl p-6 
                           shadow-lg shadow-black/20 transition-all duration-500 
                           hover:shadow-2xl hover:shadow-[#563EB7]/20 hover:border-[#563EB7]/40 hover:-translate-y-2
                           animate-fadeIn overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Stock Pattern in Card */}
                <div className="absolute inset-0 opacity-[0.12]" style={{ 
                  backgroundImage: `url(${StockPattern.src})`,
                  backgroundSize: '180px 180px',
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'center',
                  filter: 'brightness(2) contrast(1.5)'
                }} />
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#563EB7]/0 via-[#563EB7]/0 to-[#563EB7]/0 
                               group-hover:from-[#563EB7]/10 group-hover:via-[#563EB7]/5 group-hover:to-transparent 
                               transition-all duration-500 pointer-events-none" />
                
                {/* Glowing orb effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium mb-2 tracking-wide">{stat.name}</p>
                    <p className="text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                      {stat.value}
                    </p>
                    <div className="h-1 w-12 bg-gradient-to-r from-[#563EB7] to-transparent rounded-full mt-2" />
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-4 rounded-xl shadow-lg 
                                 group-hover:scale-110 group-hover:rotate-6 
                                 transition-all duration-500`}>
                    <Icon size={28} className="group-hover:animate-pulse" />
                  </div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Active Projects & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card title="Active Projects" action={
          <Link href="/projects" className="text-sm text-[#563EB7] hover:text-[#6d4dd4] font-semibold flex items-center gap-1 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        }>
          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No active projects</p>
            ) : (
              activeProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="group relative p-5 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl 
                             border border-[#563EB7]/10 hover:border-[#563EB7]/30
                             shadow-md hover:shadow-xl hover:shadow-[#563EB7]/10
                             transition-all duration-300 hover:-translate-y-1
                             animate-slideIn overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Stock Pattern in Card */}
                  <div className="absolute inset-0 opacity-[0.1]" style={{ 
                    backgroundImage: `url(${StockPattern.src})`,
                    backgroundSize: '160px 160px',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center',
                    filter: 'brightness(2) contrast(1.5)'
                  }} />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#563EB7]/0 to-[#563EB7]/0 
                                group-hover:from-[#563EB7]/5 group-hover:to-transparent 
                                transition-all duration-300 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1.5 text-lg group-hover:text-[#a78bfa] transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
                      </div>
                      <Badge variant={getStatusBadge(project.status)}>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <ProgressBar progress={project.progress} size="sm" />
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#563EB7] rounded-full" />
                        Due: {new Date(project.endDate).toLocaleDateString()}
                      </span>
                      <span className="text-[#563EB7] font-semibold">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card title="Recent Tasks" action={
          <Link href="/tasks" className="text-sm text-[#563EB7] hover:text-[#6d4dd4] font-semibold flex items-center gap-1 group">
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        }>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No tasks</p>
            ) : (
              recentTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="group relative p-5 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl 
                             border border-[#563EB7]/10 hover:border-[#563EB7]/30
                             shadow-md hover:shadow-xl hover:shadow-[#563EB7]/10
                             transition-all duration-300 hover:-translate-y-1
                             animate-slideIn overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Stock Pattern in Card */}
                  <div className="absolute inset-0 opacity-[0.1]" style={{ 
                    backgroundImage: `url(${StockPattern.src})`,
                    backgroundSize: '160px 160px',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center',
                    filter: 'brightness(2) contrast(1.5)'
                  }} />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#563EB7]/0 to-[#563EB7]/0 
                                group-hover:from-[#563EB7]/5 group-hover:to-transparent 
                                transition-all duration-300 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1.5 group-hover:text-[#a78bfa] transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-400 capitalize font-medium">
                          {task.type.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge variant={getPriorityBadge(task.priority)} size="sm">
                          {task.priority}
                        </Badge>
                        <Badge variant={getStatusBadge(task.status)} size="sm">
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#563EB7]/10">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#563EB7] rounded-full" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card title="Content & Campaigns Overview" hover={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group text-center p-6 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/10 
                         hover:border-[#563EB7]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative inline-block mb-3">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent 
                            group-hover:scale-110 transition-transform duration-300">
                {content.filter(c => c.status === 'published').length}
              </div>
              <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-gray-400 font-medium">Published Content</p>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-green-500 to-transparent rounded-full mx-auto" />
          </div>
          <div className="group text-center p-6 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/10 
                         hover:border-[#563EB7]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative inline-block mb-3">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent 
                            group-hover:scale-110 transition-transform duration-300">
                {content.filter(c => c.status === 'scheduled').length}
              </div>
              <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-gray-400 font-medium">Scheduled Content</p>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-blue-500 to-transparent rounded-full mx-auto" />
          </div>
          <div className="group text-center p-6 bg-gradient-to-br from-[#1a1333] to-[#14102a] rounded-xl border border-[#563EB7]/10 
                         hover:border-[#563EB7]/30 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative inline-block mb-3">
              <div className="text-5xl font-bold bg-gradient-to-r from-[#563EB7] to-[#7c5fdc] bg-clip-text text-transparent 
                            group-hover:scale-110 transition-transform duration-300">
                {campaigns.filter(c => c.status === 'running').length}
              </div>
              <div className="absolute -inset-2 bg-[#563EB7]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-gray-400 font-medium">Active Campaigns</p>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-[#563EB7] to-transparent rounded-full mx-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
}
