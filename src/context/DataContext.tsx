'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Project, Task, Campaign, Content, User, Notification, RolePermission, UserRole, ColumnName, CustomRole, ActionPermission as ActionPermissionType, ResourceType, ActionType } from '@/types';
import { useAuth } from './AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

type DataContextType = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  campaigns: Campaign[];
  content: Content[];
  users: User[];
  activeUsers: User[];
  notifications: Notification[];
  currentUser: User;
  loading: boolean;
  permissions: RolePermission[];
  actionPermissions: ActionPermissionType[];
  customRoles: CustomRole[];
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
  canPerformAction: (role: UserRole, resource: ResourceType, action: ActionType) => boolean;
  updatePermission: (role: UserRole, column: ColumnName, canEdit: boolean) => void;
  updateActionPermission: (role: UserRole, resource: ResourceType, action: ActionType, canPerform: boolean) => Promise<void>;
  resetPermissions: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  addCustomRole: (role: Omit<CustomRole, 'id' | 'createdAt'>) => Promise<void>;
  updateCustomRole: (id: string, role: Partial<CustomRole>) => Promise<void>;
  deleteCustomRole: (id: string) => Promise<void>;
  getAllRoles: () => { value: string; label: string; emoji: string; isCustom: boolean }[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default permissions
// Minimal default permissions (only for Admin - before API loads)
const getDefaultPermissions = (): RolePermission[] => {
  const columns: ColumnName[] = ['design-brief', 'inspiration', 'design', 'text-content', 'drive-link', 'notes', 'status'];
  
  const permissions: RolePermission[] = [];
  // Only create permissions for Admin (always true)
  columns.forEach(column => {
    permissions.push({
      role: 'admin',
      column,
      canEdit: true
    });
  });

  return permissions;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();
  
  // State management
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Permissions state
  const [permissions, setPermissions] = useState<RolePermission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('permissions');
      return saved ? JSON.parse(saved) : getDefaultPermissions();
    }
    return getDefaultPermissions();
  });

  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customRoles');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [actionPermissions, setActionPermissions] = useState<ActionPermissionType[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('actionPermissions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      // Only load permissions for admin users
      if (authUser?.role === 'admin') {
        loadPermissions();
      }
    }
  }, [isAuthenticated]);

  // Load permissions from API
  const loadPermissions = async () => {
    try {
      const [permsData, rolesData, actionPermsData] = await Promise.all([
        api.permissions.getAll(),
        api.permissions.getAllRoles(),
        api.permissions.getActionPermissions().catch(() => [])
      ]);
      
      if (permsData && permsData.length > 0) {
        // Normalize permissions (convert snake_case to camelCase)
        const normalizedPerms = (permsData as Array<{ role: string; column: string; can_edit?: boolean; canEdit?: boolean }>).map((p) => ({
          role: p.role as UserRole,
          column: p.column as ColumnName,
          canEdit: p.can_edit ?? p.canEdit ?? false,
        }));
        
        setPermissions(normalizedPerms);
        // حفظ في localStorage للـ persistence
        localStorage.setItem('permissions', JSON.stringify(normalizedPerms));
      }
      
      if (rolesData && 'roles' in rolesData && Array.isArray(rolesData.roles)) {
        // Extract only custom roles from the API response
        const customRolesList = (rolesData.roles as Array<{ id: number; value: string; label: string; emoji: string; is_custom?: boolean }>)
          .filter((role) => role.is_custom)
          .map((role) => ({
            id: String(role.id), // Backend sends id as number, convert to string
            name: role.value,
            label: role.label,
            emoji: role.emoji,
            isCustom: true,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
          }));
        setCustomRoles(customRolesList);
        // حفظ في localStorage
        localStorage.setItem('customRoles', JSON.stringify(customRolesList));
      }
      
      if (actionPermsData && actionPermsData.length > 0) {
        // Normalize action permissions
        const normalizedActionPerms = (actionPermsData as Array<{ role: string; resource: string; action: string; can_perform?: boolean; canPerform?: boolean }>).map((p) => ({
          role: p.role as UserRole,
          resource: p.resource as ResourceType,
          action: p.action as ActionType,
          canPerform: p.can_perform ?? p.canPerform ?? false,
        }));
        
        setActionPermissions(normalizedActionPerms);
        localStorage.setItem('actionPermissions', JSON.stringify(normalizedActionPerms));
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      // استخدام الصلاحيات الافتراضية في حالة الخطأ
    }
  };

  // No longer need this - loadPermissions handles localStorage sync
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('customRoles', JSON.stringify(customRoles));
  //   }
  // }, [customRoles]);

  // Refresh data from API
  const refreshData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      
      // جلب جميع البيانات من الخادم بشكل متوازي
      const [
        clientsData,
        projectsData,
        tasksData,
        campaignsData,
        contentsData,
        usersData,
      ] = await Promise.all([
        api.clients.getAll().catch(() => []),
        api.projects.getAll().catch(() => []),
        api.tasks.getAll().catch(() => []),
        api.campaigns.getAll().catch(() => []),
        api.contents.getAll().catch(() => []),
        api.users.getAll().catch(() => []),
      ]);

      setClients(clientsData);
      setProjects(projectsData);
      setTasks(tasksData);
      setCampaigns(campaignsData);
      setContent(contentsData);
      setUsers(usersData);
      
      // تحديث currentUser من authUser
      if (authUser) {
        setCurrentUser(authUser as User);
      }
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Clients CRUD
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'linkedProjects'>) => {
    try {
      const newClient = await api.clients.create(clientData);
      
      setClients([...clients, newClient]);
      toast.success('تم إضافة العميل بنجاح');
      await refreshData();
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('فشل في إضافة العميل');
      throw error;
    }
  };

  const updateClient = async (id: string, updatedClient: Partial<Client>) => {
    try {
      const updated = await api.clients.update(id, updatedClient);
      
      setClients(clients.map(c => c.id === id ? { ...c, ...updated } : c));
      toast.success('تم تحديث العميل بنجاح');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('فشل في تحديث العميل');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await api.clients.delete(id);
      setClients(clients.filter(c => c.id !== id));
      toast.success('تم حذف العميل بنجاح');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('فشل في حذف العميل');
      throw error;
    }
  };

  // Projects CRUD
  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'linkedTasks' | 'linkedCampaigns' | 'linkedContent' | 'files'>) => {
    try {
      const newProject = await api.projects.create(projectData);
      
      setProjects([...projects, newProject]);
      toast.success('تم إضافة المشروع بنجاح');
      await refreshData();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('فشل في إضافة المشروع');
      throw error;
    }
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    try {
      const updated = await api.projects.update(id, updatedProject);
      
      setProjects(projects.map(p => p.id === id ? { ...p, ...updated } : p));
      toast.success('تم تحديث المشروع بنجاح');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('فشل في تحديث المشروع');
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await api.projects.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('تم حذف المشروع بنجاح');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('فشل في حذف المشروع');
      throw error;
    }
  };

  // Tasks CRUD
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'attachments' | 'comments' | 'changeLog'>) => {
    try {
      const newTask = await api.tasks.create(taskData);
      
      setTasks([...tasks, newTask]);
      toast.success('تم إضافة المهمة بنجاح');
      await refreshData();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('فشل في إضافة المهمة');
      throw error;
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const updated = await api.tasks.update(id, updatedTask);
      
      setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
      toast.success('تم تحديث المهمة بنجاح');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('فشل في تحديث المهمة');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.tasks.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('تم حذف المهمة بنجاح');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('فشل في حذف المهمة');
      throw error;
    }
  };

  // Campaigns CRUD
  const addCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'kpis' | 'attachments'>) => {
    try {
      const newCampaign = await api.campaigns.create(campaignData);
      
      setCampaigns([...campaigns, newCampaign]);
      toast.success('تم إضافة الحملة بنجاح');
      await refreshData();
    } catch (error) {
      console.error('Error adding campaign:', error);
      toast.error('فشل في إضافة الحملة');
      throw error;
    }
  };

  const updateCampaign = async (id: string, updatedCampaign: Partial<Campaign>) => {
    try {
      const updated = await api.campaigns.update(id, updatedCampaign);
      
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updated } : c));
      toast.success('تم تحديث الحملة بنجاح');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('فشل في تحديث الحملة');
      throw error;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await api.campaigns.delete(id);
      setCampaigns(campaigns.filter(c => c.id !== id));
      toast.success('تم حذف الحملة بنجاح');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('فشل في حذف الحملة');
      throw error;
    }
  };

  // Content CRUD
  const addContent = async (contentData: Omit<Content, 'id' | 'createdAt' | 'attachments' | 'comments'>) => {
    try {
      const newContent = await api.contents.create(contentData);
      
      setContent([...content, newContent]);
      toast.success('تم إضافة المحتوى بنجاح');
      await refreshData();
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('فشل في إضافة المحتوى');
      throw error;
    }
  };

  const updateContent = async (id: string, updatedContent: Partial<Content>) => {
    try {
      const updated = await api.contents.update(id, updatedContent);
      
      setContent(content.map(c => c.id === id ? { ...c, ...updated } : c));
      toast.success('تم تحديث المحتوى بنجاح');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('فشل في تحديث المحتوى');
      throw error;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await api.contents.delete(id);
      setContent(content.filter(c => c.id !== id));
      toast.success('تم حذف المحتوى بنجاح');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('فشل في حذف المحتوى');
      throw error;
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Get active users only (for assignment dropdowns)
  const activeUsers = users.filter(u => u.status === 'active');

  // Permissions management
  const canUserEdit = (role: UserRole, column: ColumnName): boolean => {
    const permission = permissions.find(p => p.role === role && p.column === column);
    return permission?.canEdit || (permission && 'can_edit' in permission ? (permission as { can_edit?: boolean }).can_edit : false) || false;
  };

  const canPerformAction = (role: UserRole, resource: ResourceType, action: ActionType): boolean => {
    // Admin can always perform any action
    if (role === 'admin') {
      return true;
    }
    
    const permission = actionPermissions.find(
      p => p.role === role && p.resource === resource && p.action === action
    );
    return permission?.canPerform || (permission && 'can_perform' in permission ? (permission as { can_perform?: boolean }).can_perform : false) || false;
  };

  const updatePermission = async (role: UserRole, column: ColumnName, canEdit: boolean) => {
    try {
      // Update in backend
      await api.permissions.updatePermission(role, column, canEdit);
      
      // Update local state immediately (optimistic update)
      const updated = permissions.map(p => 
        p.role === role && p.column === column 
          ? { ...p, canEdit, can_edit: canEdit } 
          : p
      );
      setPermissions(updated);
      
      // Also save to localStorage for persistence
      localStorage.setItem('permissions', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
      throw error;
    }
  };

  const updateActionPermission = async (role: UserRole, resource: ResourceType, action: ActionType, canPerform: boolean) => {
    try {
      await api.permissions.updateActionPermission(role, resource, action, canPerform);
      
      // Update local state
      const existingIndex = actionPermissions.findIndex(
        p => p.role === role && p.resource === resource && p.action === action
      );
      
      let updated;
      if (existingIndex >= 0) {
        // Update existing permission
        updated = actionPermissions.map((p, i) => 
          i === existingIndex
            ? { ...p, canPerform, can_perform: canPerform }
            : p
        );
      } else {
        // Add new permission if it doesn't exist
        updated = [...actionPermissions, {
          role,
          resource,
          action,
          canPerform,
        }];
      }
      
      setActionPermissions(updated);
      localStorage.setItem('actionPermissions', JSON.stringify(updated));
      
      // Log for debugging
      console.log('Action permission updated:', { role, resource, action, canPerform });
    } catch (error) {
      console.error('Error updating action permission:', error);
      toast.error('Failed to update permission');
      throw error;
    }
  };

  const resetPermissions = async () => {
    try {
      await api.permissions.resetToDefault();
      await loadPermissions();
      toast.success('تم إعادة تعيين الصلاحيات بنجاح');
    } catch (error) {
      console.error('Error resetting permissions:', error);
      toast.error('فشل في إعادة تعيين الصلاحيات');
      throw error;
    }
  };

  // User management functions
  const updateUser = async (id: string, updatedUser: Partial<User>) => {
    try {
      const updated = await api.users.update(id, updatedUser);
      
      setUsers(users.map(u => u.id === id ? { ...u, ...updated } : u));
      toast.success('تم تحديث المستخدم بنجاح');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('فشل في تحديث المستخدم');
      throw error;
    }
  };

  // Custom Roles management
  const addCustomRole = async (roleData: Omit<CustomRole, 'id' | 'createdAt'>) => {
    try {
      await api.permissions.addCustomRole({
        name: roleData.name,
        label: roleData.label,
        emoji: roleData.emoji,
        created_by: roleData.createdBy || currentUser?.name || 'admin'
      });
      
      // Reload from API to get the new role with correct ID
      await loadPermissions();
      
      // Don't show toast here - let component handle it
    } catch (error) {
      console.error('Error adding custom role:', error);
      throw error;
    }
  };

  const updateCustomRole = async (id: string, updatedRole: Partial<CustomRole>) => {
    try {
      await api.permissions.updateCustomRole(id, {
        label: updatedRole.label,
        emoji: updatedRole.emoji
      });
      
      // Reload from API to ensure sync
      await loadPermissions();
      
      // Don't show toast here - let component handle it
    } catch (error) {
      console.error('Error updating custom role:', error);
      throw error;
    }
  };

  const deleteCustomRole = async (id: string) => {
    try {
      await api.permissions.deleteCustomRole(id);
      
      const roleToDelete = customRoles.find(r => r.id === id);
      
      // Update local state immediately
      setCustomRoles(customRoles.filter(r => r.id !== id));
      
      // حذف الصلاحيات المرتبطة بهذا الدور
      if (roleToDelete) {
        setPermissions(permissions.filter(p => p.role !== roleToDelete.name));
      }
      
      // Reload from API to ensure sync
      await loadPermissions();
      
      // Don't show toast here - let the calling component handle it
    } catch (error) {
      console.error('Error deleting custom role:', error);
      // Re-throw the error with the message from the API
      throw error;
    }
  };

  const getAllRoles = () => {
    // Admin فقط هو الـ role الثابت الوحيد
    const adminRole = [
      { id: null, value: 'admin', label: 'Admin', emoji: '👑', isCustom: false, isAdmin: true },
    ];

    // جميع الأدوار الأخرى من custom_roles (قابلة للحذف)
    const customRolesList = customRoles.map(role => ({
      id: role.id,
      value: role.name,
      label: role.label,
      emoji: role.emoji,
      isCustom: true,
      isAdmin: false,
    }));

    return [...adminRole, ...customRolesList];
  };

  const approveUser = async (userId: string) => {
    try {
      await api.users.approve(userId);
      await refreshData();
      toast.success('تم الموافقة على المستخدم بنجاح');
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('فشل في الموافقة على المستخدم');
      throw error;
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      await api.users.reject(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('تم رفض المستخدم بنجاح');
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('فشل في رفض المستخدم');
      throw error;
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      await api.users.suspend(userId);
      await refreshData();
      toast.success('تم تعليق المستخدم بنجاح');
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('فشل في تعليق المستخدم');
      throw error;
    }
  };

  const activateUser = async (userId: string) => {
    try {
      await api.users.activate(userId);
      await refreshData();
      toast.success('تم تفعيل المستخدم بنجاح');
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('فشل في تفعيل المستخدم');
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.users.delete(userId);
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      clients,
      projects,
      tasks,
      campaigns,
      content,
      users,
      activeUsers,
      notifications,
      currentUser: currentUser || {} as User,
      loading,
      permissions,
      actionPermissions,
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
      canPerformAction,
      updatePermission,
      updateActionPermission,
      resetPermissions,
      approveUser,
      rejectUser,
      suspendUser,
      activateUser,
      deleteUser,
      updateUser,
      customRoles,
      addCustomRole,
      updateCustomRole,
      deleteCustomRole,
      getAllRoles,
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

