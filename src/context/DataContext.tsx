'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Project, Task, Campaign, Content, User, Notification } from '@/types';
import { 
  users as initialUsers,
  notifications as initialNotifications
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
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [users] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [currentUser] = useState<User>(initialUsers[0]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  const refreshData = async () => {
    try {
      setLoading(true);
      const [clientsData, projectsData, tasksData, campaignsData, contentData] = await Promise.all([
        fetch('/api/clients').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/projects').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/tasks').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/campaigns').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/content').then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      setClients(clientsData);
      setProjects(projectsData);
      setTasks(tasksData);
      setCampaigns(campaignsData);
      setContent(contentData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Clients CRUD
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'linkedProjects'>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      const newClient = await response.json();
      setClients([...clients, { ...newClient, linkedProjects: [] }]);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const updateClient = async (id: string, updatedClient: Partial<Client>) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient),
      });
      const updated = await response.json();
      setClients(clients.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Projects CRUD
  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'linkedTasks' | 'linkedCampaigns' | 'linkedContent' | 'files'>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectData,
          projectManagerId: projectData.projectManager,
          createdById: currentUser.id,
        }),
      });
      const newProject = await response.json();
      setProjects([...projects, { 
        ...newProject, 
        linkedTasks: [], 
        linkedCampaigns: [], 
        linkedContent: [], 
        files: [] 
      }]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      const updated = await response.json();
      setProjects(projects.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Tasks CRUD
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'attachments' | 'comments' | 'changeLog'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          assignedToId: taskData.assignedTo,
          createdById: currentUser.id,
        }),
      });
      const newTask = await response.json();
      setTasks([...tasks, { 
        ...newTask, 
        subtasks: [], 
        attachments: [], 
        comments: [], 
        changeLog: [] 
      }]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedTask,
          changedById: currentUser.id,
        }),
      });
      const updated = await response.json();
      setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Campaigns CRUD
  const addCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'kpis' | 'attachments'>) => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaignData,
          responsiblePersonId: campaignData.responsiblePerson,
          createdById: currentUser.id,
        }),
      });
      const newCampaign = await response.json();
      setCampaigns([...campaigns, { ...newCampaign, kpis: [], attachments: [] }]);
    } catch (error) {
      console.error('Error adding campaign:', error);
    }
  };

  const updateCampaign = async (id: string, updatedCampaign: Partial<Campaign>) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCampaign),
      });
      const updated = await response.json();
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  // Content CRUD
  const addContent = async (contentData: Omit<Content, 'id' | 'createdAt' | 'attachments' | 'comments'>) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contentData,
          assignedToId: contentData.assignedTo,
          createdById: currentUser.id,
        }),
      });
      const newContent = await response.json();
      setContent([...content, { ...newContent, attachments: [], comments: [] }]);
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const updateContent = async (id: string, updatedContent: Partial<Content>) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });
      const updated = await response.json();
      setContent(content.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      setContent(content.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
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

