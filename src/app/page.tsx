'use client';

import { useData } from '@/context/DataContext';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import { Users, FolderKanban, CheckSquare, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.link}>
              <Card className="hover:border-[#563EB7]/40 transition-colors cursor-pointer">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-4 rounded-lg`}>
                    <Icon size={28} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Active Projects & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card title="Active Projects" action={<Link href="/projects" className="text-sm text-[#563EB7] hover:text-[#6d4dd4]">View All</Link>}>
          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No active projects</p>
            ) : (
              activeProjects.map((project) => (
                <div key={project.id} className="p-4 bg-[#1a1333] rounded-lg hover:bg-[#241a47] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
                    </div>
                    <Badge variant={getStatusBadge(project.status)}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <ProgressBar progress={project.progress} size="sm" />
                  <div className="mt-2 text-xs text-gray-400">
                    Due: {new Date(project.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card title="Recent Tasks" action={<Link href="/tasks" className="text-sm text-[#563EB7] hover:text-[#6d4dd4]">View All</Link>}>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No tasks</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="p-4 bg-[#1a1333] rounded-lg hover:bg-[#241a47] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-400">{task.type.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityBadge(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      <Badge variant={getStatusBadge(task.status)} size="sm">
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card title="Content & Campaigns Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#563EB7] mb-2">{content.filter(c => c.status === 'published').length}</div>
            <p className="text-gray-400">Published Content</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#563EB7] mb-2">{content.filter(c => c.status === 'scheduled').length}</div>
            <p className="text-gray-400">Scheduled Content</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#563EB7] mb-2">{campaigns.filter(c => c.status === 'running').length}</div>
            <p className="text-gray-400">Active Campaigns</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
