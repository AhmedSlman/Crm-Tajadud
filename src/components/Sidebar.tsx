'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  Calendar,
  BarChart3,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Content Plan', href: '/content', icon: FileText },
  { name: 'Social Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gradient-to-b from-[#14102a] to-[#0c081e] h-screen fixed left-0 top-0 flex flex-col border-r border-[#563EB7]/30 shadow-2xl shadow-black/50">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#563EB7]/5 via-transparent to-[#7c5fdc]/5 opacity-50" />
      
      <div className="relative z-10 p-6 border-b border-[#563EB7]/20">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-xl flex items-center justify-center shadow-lg shadow-[#563EB7]/50 group-hover:shadow-[#563EB7]/80 transition-all duration-300 group-hover:scale-110">
              <Sparkles className="text-white" size={20} />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
          </div>
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Agency CRM
          </span>
        </h1>
      </div>
      
      <nav className="relative z-10 flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
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
          <div className="text-gray-500">© 2025 Agency CRM</div>
        </div>
      </div>
    </div>
  );
}

