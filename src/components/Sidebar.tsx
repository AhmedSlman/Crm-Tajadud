'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/assets/dqdddd.svg';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  Calendar,
  BarChart3,
  Sparkles,
  UserCog,
  Shield,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: false },
  { name: 'Clients', href: '/clients', icon: Users, adminOnly: false },
  { name: 'Projects', href: '/projects', icon: FolderKanban, adminOnly: false },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, adminOnly: false },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone, adminOnly: false },
  { name: 'Content Plan', href: '/content', icon: FileText, adminOnly: false },
  { name: 'Social Calendar', href: '/calendar', icon: Calendar, adminOnly: false },
  { name: 'Reports', href: '/reports', icon: BarChart3, adminOnly: false },
  { name: 'Users', href: '/users', icon: UserCog, adminOnly: true },
  { name: 'Permissions', href: '/permissions', icon: Shield, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      if (isMobileMenuOpen && sidebar && !sidebar.contains(e.target as Node) && !menuButton?.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#14102a] border border-[#563EB7]/30 rounded-lg text-white hover:bg-[#1a1333] transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        id="mobile-sidebar"
        className={`
          w-64 bg-gradient-to-b from-[#14102a] to-[#0c081e] h-screen fixed left-0 top-0 flex flex-col 
          border-r border-[#563EB7]/30 shadow-2xl shadow-black/50 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#563EB7]/5 via-transparent to-[#7c5fdc]/5 opacity-50" />
      
      <div className="relative z-10 px-6 py-3 border-b border-[#563EB7]/20">
        <div className="flex items-center justify-center group">
          <div className="relative">
            <Image 
              src={Logo} 
              alt="Company Logo" 
              width={300} 
              height={36}
              quality={100}
              className="object-contain w-[150px] h-auto transition-all duration-500 group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(124,95,220,0.3)]"
              priority
              unoptimized
            />
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#563EB7]/20 to-[#7c5fdc]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>
      </div>
      
      <nav className="relative z-10 flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name} className="animate-slideIn" style={{ animationDelay: `${index * 50}ms` }}>
                <Link
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3.5 rounded-xl 
                    transition-all duration-300 overflow-hidden
                    ${isActive
                      ? 'bg-gradient-to-r from-[#563EB7] to-[#6d4dd4] text-white shadow-lg shadow-[#563EB7]/40'
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  {/* Hover background effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#563EB7]/10 to-[#7c5fdc]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/50" />
                  )}
                  
                  <div className={`relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                    <Icon size={20} />
                  </div>
                  <span className="relative z-10 font-medium tracking-wide">{item.name}</span>
                  
                  {/* Sparkle effect on hover */}
                  {!isActive && (
                    <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1 h-1 bg-[#563EB7] rounded-full" />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative z-10 p-6 border-t border-[#563EB7]/20 backdrop-blur-sm">
        <div className="text-xs text-gray-400 text-center font-medium">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>System Active</span>
          </div>
          <div className="text-gray-500">© 2025 Tajadud</div>
        </div>
      </div>
    </div>
    </>
  );
}

