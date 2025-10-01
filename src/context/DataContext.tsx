'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Project, Task, Campaign, Content, User, Notification, RolePermission, UserRole, ColumnName } from '@/types';
import { 
  users as initialUsers,
  notifications as initialNotifications,
  clients as initialClients,
  projects as initialProjects,
  tasks as initialTasks,
  campaigns as initialCampaigns,
  content as initialContent
} from '@/lib/dummy-data';

type DataContextType = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  campaigns: Campaign[];
  content: Content[];
  users: User[];
  notifications: Notification[];
  currentUser: User;
  loading: boolean;
  permissions: RolePermission[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'linkedProjects'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'linkedTasks' | 'linkedCampaigns' | 'linkedContent' | 'files'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'attachments' | 'comments' | 'changeLog'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'kpis' | 'attachments'>) => Promise<void>;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  addContent: (content: Omit<Content, 'id' | 'createdAt' | 'attachments' | 'comments'>) => Promise<void>;
  updateContent: (id: string, content: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  refreshData: () => Promise<void>;
  canUserEdit: (role: UserRole, column: ColumnName) => boolean;
  updatePermission: (role: UserRole, column: ColumnName, canEdit: boolean) => void;
  resetPermissions: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default permissions
const getDefaultPermissions = (): RolePermission[] => {
  const roles: UserRole[] = ['admin', 'account-manager', 'graphic-designer', 'social-media', 'content-writer', 'video-editor', 'ads-specialist', 'seo-specialist'];
  const columns: ColumnName[] = ['design-brief', 'inspiration', 'design', 'text-content', 'drive-link', 'notes', 'status'];
  
  const defaultPerms: Record<string, UserRole[]> = {
    'design-brief': ['admin', 'account-manager', 'social-media'],
    'inspiration': ['admin', 'account-manager', 'social-media', 'graphic-designer'],
    'design': ['admin', 'graphic-designer'],
    'text-content': ['admin', 'account-manager', 'social-media', 'content-writer'],
    'drive-link': ['admin', 'account-manager', 'graphic-designer', 'video-editor'],
    'notes': ['admin', 'account-manager', 'social-media'],
    'status': ['admin', 'account-manager', 'social-media'],
  };

  const permissions: RolePermission[] = [];
  roles.forEach(role => {
    columns.forEach(column => {
      permissions.push({
        role,
        column,
        canEdit: defaultPerms[column]?.includes(role) || false
      });
    });
  });

  return permissions;
};

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or use defaults
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clients');
      return saved ? JSON.parse(saved) : initialClients;
    }
    return initialClients;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : initialProjects;
    }
    return initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    }
    return initialTasks;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campaigns');
      return saved ? JSON.parse(saved) : initialCampaigns;
    }
    return initialCampaigns;
  });

  const [content, setContent] = useState<Content[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('content');
      return saved ? JSON.parse(saved) : initialContent;
    }
    return initialContent;
  });

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('users');
      return saved ? JSON.parse(saved) : initialUsers;
    }
    return initialUsers;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : initialNotifications;
    }
    return initialNotifications;
  });

  const [currentUser] = useState<User>(initialUsers[0]);
  const [loading] = useState(false);
  
  // Permissions state
  const [permissions, setPermissions] = useState<RolePermission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('permissions');
      return saved ? JSON.parse(saved) : getDefaultPermissions();
    }
    return getDefaultPermissions();
  });

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clients', JSON.stringify(clients));
    }
  }, [clients]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('content', JSON.stringify(content));
    }
  }, [content]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Refresh data from static sources
  const refreshData = async () => {
    // Data is already loaded from static sources
    console.log('Data refreshed from static sources');
  };

  // Clients CRUD
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'linkedProjects'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      linkedProjects: []
    };
    setClients([...clients, newClient]);
  };

  const updateClient = async (id: string, updatedClient: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updatedClient } : c));
  };

  const deleteClient = async (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  // Projects CRUD
  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'linkedTasks' | 'linkedCampaigns' | 'linkedContent' | 'files'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      linkedTasks: [],
      linkedCampaigns: [],
      linkedContent: [],
      files: []
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = async (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Tasks CRUD
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'attachments' | 'comments' | 'changeLog'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      subtasks: [],
      attachments: [],
      comments: [],
      changeLog: []
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t));
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Campaigns CRUD
  const addCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'kpis' | 'attachments'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      kpis: [],
      attachments: []
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const updateCampaign = async (id: string, updatedCampaign: Partial<Campaign>) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updatedCampaign } : c));
  };

  const deleteCampaign = async (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  // Content CRUD
  const addContent = async (contentData: Omit<Content, 'id' | 'createdAt' | 'attachments' | 'comments'>) => {
    const newContent: Content = {
      ...contentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      attachments: [],
      comments: []
    };
    setContent([...content, newContent]);
  };

  const updateContent = async (id: string, updatedContent: Partial<Content>) => {
    setContent(content.map(c => c.id === id ? { ...c, ...updatedContent } : c));
  };

  const deleteContent = async (id: string) => {
    setContent(content.filter(c => c.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Permissions management
  const canUserEdit = (role: UserRole, column: ColumnName): boolean => {
    const permission = permissions.find(p => p.role === role && p.column === column);
    return permission?.canEdit || false;
  };

  const updatePermission = (role: UserRole, column: ColumnName, canEdit: boolean) => {
    const updated = permissions.map(p => 
      p.role === role && p.column === column 
        ? { ...p, canEdit } 
        : p
    );
    setPermissions(updated);
    localStorage.setItem('permissions', JSON.stringify(updated));
  };

  const resetPermissions = () => {
    const defaultPerms = getDefaultPermissions();
    setPermissions(defaultPerms);
    localStorage.setItem('permissions', JSON.stringify(defaultPerms));
  };

  // User management functions
  const updateUser = async (id: string, updatedUser: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updatedUser } : u));
  };

  const approveUser = async (userId: string) => {
    // TODO: Replace with API call
    const approvedUser = users.find(u => u.id === userId);
    if (approvedUser) {
      await updateUser(userId, {
        status: 'active',
        approvedBy: currentUser.name,
        approvedAt: new Date().toISOString()
      });
    }
  };

  const rejectUser = async (userId: string) => {
    // TODO: Replace with API call
    setUsers(users.filter(u => u.id !== userId));
  };

  const suspendUser = async (userId: string) => {
    // TODO: Replace with API call
    await updateUser(userId, { status: 'suspended' });
  };

  const activateUser = async (userId: string) => {
    // TODO: Replace with API call
    await updateUser(userId, { status: 'active' });
  };

  return (
    <DataContext.Provider value={{
      clients,
      projects,
      tasks,
      campaigns,
      content,
      users,
      notifications,
      currentUser,
      loading,
      permissions,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addContent,
      updateContent,
      deleteContent,
      markNotificationAsRead,
      refreshData,
      canUserEdit,
      updatePermission,
      resetPermissions,
      approveUser,
      rejectUser,
      suspendUser,
      activateUser,
      updateUser,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

