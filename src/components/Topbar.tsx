'use client';

import { Bell, Search, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useData } from '@/context/DataContext';

export default function Topbar() {
  const { notifications, currentUser, markNotificationAsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-16 bg-[#14102a] border-b border-[#563EB7]/20 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects, tasks, clients..."
            className="w-full bg-[#1a1333] border border-[#563EB7]/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#563EB7] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-300 hover:text-white hover:bg-[#1a1333] rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a1333] border border-[#563EB7]/20 rounded-lg shadow-xl overflow-hidden">
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

        <button className="p-2 text-gray-300 hover:text-white hover:bg-[#1a1333] rounded-lg transition-colors">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#563EB7]/20">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{currentUser.name}</p>
            <p className="text-xs text-gray-400 capitalize">{currentUser.role.replace('-', ' ')}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-full flex items-center justify-center">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

