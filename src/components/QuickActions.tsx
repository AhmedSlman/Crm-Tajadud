'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckSquare, 
  FolderKanban, 
  Users, 
  Megaphone, 
  FileText,
  Search,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Action = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  shortcut?: string;
};

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions: Action[] = [
    {
      id: 'new-task',
      label: 'New Task',
      icon: CheckSquare,
      action: () => router.push('/tasks'),
      shortcut: 'T',
    },
    {
      id: 'new-project',
      label: 'New Project',
      icon: FolderKanban,
      action: () => router.push('/projects'),
      shortcut: 'P',
    },
    {
      id: 'new-client',
      label: 'New Client',
      icon: Users,
      action: () => router.push('/clients'),
      shortcut: 'C',
    },
    {
      id: 'new-campaign',
      label: 'New Campaign',
      icon: Megaphone,
      action: () => router.push('/campaigns'),
      shortcut: 'M',
    },
    {
      id: 'new-content',
      label: 'New Content',
      icon: FileText,
      action: () => router.push('/content'),
      shortcut: 'N',
    },
    {
      id: 'go-dashboard',
      label: 'Go to Dashboard',
      icon: Zap,
      action: () => router.push('/'),
      shortcut: 'D',
    },
    {
      id: 'go-reports',
      label: 'Go to Reports',
      icon: TrendingUp,
      action: () => router.push('/reports'),
      shortcut: 'R',
    },
  ];

  const filteredActions = searchQuery
    ? actions.filter(action => action.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : actions;

  const handleAction = (action: Action) => {
    action.action();
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-[#563EB7] to-[#6d4dd4] hover:from-[#6d4dd4] hover:to-[#7c5fdc] text-white rounded-full shadow-2xl shadow-[#563EB7]/50 hover:shadow-[#563EB7]/70 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        title="Quick Actions (Ctrl+K)"
      >
        <Zap size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-[#563EB7] animate-ping opacity-20" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#14102a] to-[#1a1333] border border-[#563EB7]/30 rounded-2xl shadow-2xl animate-scaleIn">
            {/* Search */}
            <div className="p-4 border-b border-[#563EB7]/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search actions..."
                  className="w-full bg-[#1a1333] border border-[#563EB7]/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#563EB7]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  Esc to close
                </div>
              </div>
            </div>

            {/* Actions List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No actions found</div>
              ) : (
                filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#563EB7]/20 transition-all duration-300 group text-left"
                    >
                      <div className="p-2 bg-[#563EB7]/20 rounded-lg group-hover:bg-[#563EB7]/30 transition-colors">
                        <Icon size={20} className="text-[#563EB7] group-hover:text-[#a78bfa]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white group-hover:text-[#a78bfa] transition-colors">
                          {action.label}
                        </div>
                      </div>
                      {action.shortcut && (
                        <div className="px-2 py-1 bg-[#1a1333] border border-[#563EB7]/20 rounded text-xs text-gray-400 font-mono">
                          {action.shortcut}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#563EB7]/20 flex items-center justify-between text-xs text-gray-400">
              <span>Press <kbd className="px-2 py-1 bg-[#1a1333] border border-[#563EB7]/20 rounded font-mono">Ctrl+K</kbd> to open</span>
              <span>Navigate with arrow keys</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

