'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Client, Project, Task, Campaign, Content, User, Notification } from '@/types';
import { 
  clients as initialClients, 
  projects as initialProjects, 
  tasks as initialTasks, 
  campaigns as initialCampaigns, 
  content as initialContent,
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
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  addContent: (content: Content) => void;
  updateContent: (id: string, content: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [content, setContent] = useState<Content[]>(initialContent);
  const [users] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [currentUser] = useState<User>(initialUsers[0]); // Default to first user

  const addClient = (client: Client) => setClients([...clients, client]);
  const updateClient = (id: string, updatedClient: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updatedClient } : c));
  };
  const deleteClient = (id: string) => setClients(clients.filter(c => c.id !== id));

  const addProject = (project: Project) => setProjects([...projects, project]);
  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t));
  };
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const addCampaign = (campaign: Campaign) => setCampaigns([...campaigns, campaign]);
  const updateCampaign = (id: string, updatedCampaign: Partial<Campaign>) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updatedCampaign } : c));
  };
  const deleteCampaign = (id: string) => setCampaigns(campaigns.filter(c => c.id !== id));

  const addContent = (newContent: Content) => setContent([...content, newContent]);
  const updateContent = (id: string, updatedContent: Partial<Content>) => {
    setContent(content.map(c => c.id === id ? { ...c, ...updatedContent } : c));
  };
  const deleteContent = (id: string) => setContent(content.filter(c => c.id !== id));

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

