'use client';

import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export default function Topbar() {
  const router = useRouter();
  const { notifications, markNotificationAsRead } = useData();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Admin',
      'account-manager': 'Account Manager',
      'graphic-designer': 'Graphic Designer',
      'social-media': 'Social Media',
      'content-writer': 'Content Writer',
      'video-editor': 'Video Editor',
      'ads-specialist': 'Ads Specialist',
      'seo-specialist': 'SEO Specialist',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="h-16 bg-gradient-to-r from-[#14102a] via-[#1a1333] to-[#14102a] border-b border-[#563EB7]/30 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#563EB7] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search projects, tasks, clients..."
            className="w-full bg-gradient-to-r from-[#1a1333] to-[#14102a] border border-[#563EB7]/20 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#563EB7] focus:shadow-lg focus:shadow-[#563EB7]/20 transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#563EB7]/0 to-[#563EB7]/0 group-focus-within:from-[#563EB7]/5 group-focus-within:to-transparent transition-all duration-300 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-6">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-300 hover:text-white hover:bg-[#1a1333] rounded-xl transition-all duration-300 hover:scale-110 group"
          >
            <Bell size={20} className="group-hover:animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-red-500/50 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-[#1a1333] to-[#14102a] border border-[#563EB7]/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-scaleIn backdrop-blur-xl">
              <div className="p-4 border-b border-[#563EB7]/20">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        markNotificationAsRead(notification.id);
                        setShowNotifications(false);
                      }}
                      className={`p-4 border-b border-[#563EB7]/10 hover:bg-[#14102a] cursor-pointer transition-colors ${
                        !notification.read ? 'bg-[#563EB7]/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-[#563EB7]' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="p-2.5 text-gray-300 hover:text-white hover:bg-[#1a1333] rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90">
          <Settings size={20} />
        </button>

        {user && (
          <div className="relative flex items-center gap-3 pl-4 border-l border-[#563EB7]/30">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-gray-400 font-medium">{getRoleLabel(user.role)}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative group cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-[#563EB7]/50 group-hover:shadow-[#563EB7]/80 transition-all duration-300 group-hover:scale-110">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-[#1a1333] to-[#14102a] border border-[#563EB7]/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-scaleIn backdrop-blur-xl z-50">
                  <div className="p-4 border-b border-[#563EB7]/20">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#563EB7]/20 transition-colors text-left"
                    >
                      <User size={16} className="text-gray-400" />
                      <span className="text-white text-sm">My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#563EB7]/20 transition-colors text-left"
                    >
                      <Settings size={16} className="text-gray-400" />
                      <span className="text-white text-sm">Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-[#563EB7]/20">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-left"
                    >
                      <LogOut size={16} className="text-red-400" />
                      <span className="text-red-400 text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

