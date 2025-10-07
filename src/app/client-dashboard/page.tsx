'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import Badge from '@/components/Badge';
import ClientProtectedRoute from '@/components/ClientProtectedRoute';
import { 
  Building2, 
  LogOut, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  BarChart3,
  Target,
  Zap, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ClientUser, ClientProjectView, ClientNotification } from '@/types';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function ClientDashboardPage() {
  const router = useRouter();
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [clientProjects, setClientProjects] = useState<ClientProjectView[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{
    projects?: { total: number; active: number; completed: number };
    tasks?: { total: number; completed: number };
  } | null>(null);

  useEffect(() => {
    // Get client user from localStorage (already validated by ClientProtectedRoute)
    const storedClient = localStorage.getItem('clientUser');
    if (storedClient) {
      const client = JSON.parse(storedClient);
      setClientUser(client);
      loadClientData();
    }
  }, []);

  const loadClientData = async () => {
    try {
      setLoading(true);
      
      // جلب البيانات من الخادم
      const [dashboardData, projectsData, notificationsData] = await Promise.all([
        api.clientPortal.getDashboard(),
        api.clientPortal.getProjects(),
        api.clientPortal.getNotifications(),
      ]);

      setDashboardStats(dashboardData.stats as typeof dashboardStats);
      setClientProjects(projectsData);
      setNotifications(notificationsData);
      
    } catch (error) {
      console.error('Error loading client data:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    toast.success('Logged out successfully! 👋');
    router.push('/client-login');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'planned': return 'info';
      case 'on-hold': return 'default';
      default: return 'default';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-400" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'info': return <Bell className="text-blue-400" size={20} />;
      default: return <Bell className="text-gray-400" size={20} />;
    }
  };

  if (loading) {
    return (
      <ClientProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </ClientProtectedRoute>
    );
  }

  if (!clientUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalProjects = dashboardStats?.projects?.total || clientProjects.length;
  const activeProjects = dashboardStats?.projects?.active || clientProjects.filter(p => p.status === 'in-progress').length;
  const completedProjects = dashboardStats?.projects?.completed || clientProjects.filter(p => p.status === 'completed').length;
  const totalTasks = dashboardStats?.tasks?.total || 0;
  const completedTasks = dashboardStats?.tasks?.completed || 0;

  return (
    <ClientProtectedRoute>
      <div className="min-h-screen bg-[#0c081e] text-white">
      {/* Header */}
      <div className="bg-[#14102a] border-b border-[#563EB7]/20 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Client Portal</h1>
              <p className="text-sm text-gray-400">{clientUser.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1333] border border-[#563EB7]/30 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-[#563EB7]/20">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-[#563EB7]/10">
                      {notifications.map((notif, index) => (
                        <div
                          key={notif.id || `notif-${index}`}
                          className={`p-4 hover:bg-[#563EB7]/10 cursor-pointer ${
                            !notif.read ? 'bg-[#563EB7]/5' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notif.id || index.toString())}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notif.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-white text-sm">{notif.title}</h4>
                              <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                              {notif.createdAt && (
                                <p className="text-gray-500 text-xs mt-2">
                                  {formatDateTime(notif.createdAt)}
                                </p>
                              )}
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <img
                src={clientUser.avatar}
                alt={clientUser.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-white">{clientUser.name}</p>
                <p className="text-xs text-gray-400">Client</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#563EB7]/20 to-[#8B5CF6]/20 border border-[#563EB7]/30 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Welcome back, {clientUser.name}! 👋
              </h2>
              <p className="text-sm sm:text-base text-gray-300">
                Here&apos;s what&apos;s happening with your projects at {clientUser.company}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-400">Last login</p>
              <p className="text-white font-medium">
                {clientUser.lastLogin ? formatDateTime(clientUser.lastLogin) : 'Today'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-blue-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{totalProjects}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Total Projects</h3>
              <p className="text-sm text-gray-400">
                {activeProjects} active, {completedProjects} completed
              </p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-green-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">Task Progress</h3>
              <p className="text-sm text-gray-400">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Target className="text-purple-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">
                  {clientProjects.reduce((sum, p) => sum + (p.activeCampaigns || 0), 0)}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">Active Campaigns</h3>
              <p className="text-sm text-gray-400">Running across all projects</p>
            </div>
          </Card>

          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="text-orange-400" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">
                  {clientProjects.reduce((sum, p) => sum + (p.publishedContent || 0), 0)}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">Published Content</h3>
              <p className="text-sm text-gray-400">Total content pieces live</p>
            </div>
          </Card>
        </div>

        {/* Projects Overview */}
        <Card title="Your Projects" className="overflow-hidden">
          {clientProjects.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400">Your projects will appear here once they&apos;re created.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#563EB7]/10">
              {clientProjects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-[#1a1333]/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <Badge variant={getStatusColor(project.status)} size="sm">
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Overall Progress</span>
                          <span className="text-sm font-medium text-white">{project.progress}%</span>
                        </div>
                        <ProgressBar progress={project.progress} />
                      </div>
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/client-project/${project.id}`)}
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-[#1a1333] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="text-green-400" size={16} />
                        <span className="text-xs text-gray-400">Tasks</span>
                      </div>
                      <p className="text-sm font-medium text-white">
                        {project.completedTasks}/{project.totalTasks}
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1333] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="text-orange-400" size={16} />
                        <span className="text-xs text-gray-400">Content</span>
                      </div>
                      <p className="text-sm font-medium text-white">
                        {project.publishedContent}/{project.totalContent}
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1333] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="text-purple-400" size={16} />
                        <span className="text-xs text-gray-400">Campaigns</span>
                      </div>
                      <p className="text-sm font-medium text-white">
                        {project.activeCampaigns} active
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1333] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-blue-400" size={16} />
                        <span className="text-xs text-gray-400">Next Deadline</span>
                      </div>
                      <p className="text-sm font-medium text-white">
                        {project.nextDeadline 
                          ? new Date(project.nextDeadline).toLocaleDateString()
                          : 'None'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card title="Need Help?" hover={false}>
            <div className="p-6">
              <p className="text-gray-400 mb-4">
                Have questions about your projects or need support?
              </p>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-between"
                  onClick={() => {
                    if (clientProjects.length > 0) {
                      router.push(`/client-project/${clientProjects[0].id}#messages`);
                    } else {
                      toast.info('No projects available');
                    }
                  }}
                >
                  Contact Project Manager
                  <ArrowRight size={16} />
                </Button>
                <Button variant="secondary" className="w-full justify-between" disabled>
                  View Help Center
                  <ExternalLink size={16} />
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Recent Activity" hover={false}>
            <div className="p-6">
              {notifications.slice(0, 3).map((notif, index) => (
                <div key={notif.id || `notif-${index}`} className="flex items-start gap-3 mb-3 last:mb-0">
                  {getNotificationIcon(notif.type)}
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{notif.title}</p>
                    {notif.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(notif.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-gray-400 text-sm">No recent activity</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
    </ClientProtectedRoute>
  );
}
