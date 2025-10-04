// API Client للتعامل مع Laravel Backend
import { AuthUser, LoginCredentials, RegisterData, ClientUser } from '@/types';
import config from './config';

const API_BASE_URL = config.api.baseUrl;

// Helper function للحصول على التوكن
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper function للحصول على client token
const getClientToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('clientToken');
};

// Helper function لإنشاء headers
const createHeaders = (isClient = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = isClient ? getClientToken() : getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function للتعامل مع الاستجابات
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  // تسجيل دخول أعضاء الفريق
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    
    // حفظ التوكن
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  },

  // تسجيل عضو فريق جديد
  async register(userData: RegisterData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    await handleResponse(response);
  },

  // تسجيل دخول العملاء
  async clientLogin(credentials: LoginCredentials): Promise<ClientUser> {
    const response = await fetch(`${API_BASE_URL}/auth/client-login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    
    // حفظ التوكن
    if (data.token) {
      localStorage.setItem('clientToken', data.token);
      localStorage.setItem('clientUser', JSON.stringify(data));
    }

    return data;
  },

  // الحصول على بيانات المستخدم الحالي
  async me(isClient = false): Promise<AuthUser | ClientUser> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: createHeaders(isClient),
    });

    return handleResponse(response);
  },

  // التحقق من صحة التوكن
  async validateToken(isClient = false): Promise<{ valid: boolean; user?: AuthUser | ClientUser }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: 'GET',
        headers: createHeaders(isClient),
      });

      return handleResponse(response);
    } catch (error) {
      return { valid: false };
    }
  },

  // تسجيل الخروج
  async logout(isClient = false): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: createHeaders(isClient),
    });

    await handleResponse(response);
    
    // مسح البيانات المحلية
    if (isClient) {
      localStorage.removeItem('clientToken');
      localStorage.removeItem('clientUser');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // طلب إعادة تعيين كلمة المرور
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    return handleResponse(response);
  },

  // تحديث الملف الشخصي
  async updateProfile(profileData: any, isClient = false): Promise<{ message: string; user: AuthUser | ClientUser }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: createHeaders(isClient),
      body: JSON.stringify(profileData),
    });

    const data = await handleResponse(response);
    
    // تحديث البيانات المحلية
    if (isClient) {
      localStorage.setItem('clientUser', JSON.stringify(data.user));
    } else {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  // تغيير كلمة المرور
  async changePassword(currentPassword: string, newPassword: string, passwordConfirmation: string, isClient = false): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: createHeaders(isClient),
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      }),
    });

    return handleResponse(response);
  },

  // إحصائيات المصادقة (للأدمن فقط)
  async getAuthStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Users API
export const usersAPI = {
  // الحصول على جميع المستخدمين
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مستخدم بالـ ID
  async getById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء مستخدم جديد
  async create(userData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  // تحديث مستخدم
  async update(id: string, userData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  // حذف مستخدم
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // الحصول على المستخدمين المعلقين
  async getPending(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/users/pending`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الموافقة على مستخدم
  async approve(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/approve`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // رفض مستخدم
  async reject(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reject`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // تعليق مستخدم
  async suspend(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/suspend`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // تفعيل مستخدم
  async activate(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/activate`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Clients API
export const clientsAPI = {
  // الحصول على جميع العملاء
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على عميل بالـ ID
  async getById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء عميل جديد
  async create(clientData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(clientData),
    });

    return handleResponse(response);
  },

  // تحديث عميل
  async update(id: string, clientData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(clientData),
    });

    return handleResponse(response);
  },

  // حذف عميل
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // الحصول على مشاريع العميل
  async getProjects(id: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}/projects`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Projects API
export const projectsAPI = {
  // الحصول على جميع المشاريع
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مشروع بالـ ID
  async getById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء مشروع جديد
  async create(projectData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(projectData),
    });

    return handleResponse(response);
  },

  // تحديث مشروع
  async update(id: string, projectData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(projectData),
    });

    return handleResponse(response);
  },

  // حذف مشروع
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // الحصول على إحصائيات المشروع
  async getStats(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // رفع ملف للمشروع
  async uploadFile(id: string, file: File, name: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await fetch(`${API_BASE_URL}/projects/${id}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    return handleResponse(response);
  },
};

// Tasks API
export const tasksAPI = {
  // الحصول على جميع المهام
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مهامي
  async getMyTasks(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/my-tasks`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مهام المشروع
  async getProjectTasks(projectId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مهمة بالـ ID
  async getById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء مهمة جديدة
  async create(taskData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(taskData),
    });

    return handleResponse(response);
  },

  // تحديث مهمة
  async update(id: string, taskData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(taskData),
    });

    return handleResponse(response);
  },

  // حذف مهمة
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // إضافة تعليق للمهمة
  async addComment(id: string, text: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/comments`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ text }),
    });

    return handleResponse(response);
  },

  // إضافة مرفق للمهمة
  async addAttachment(id: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/tasks/${id}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    return handleResponse(response);
  },
};

// Campaigns API
export const campaignsAPI = {
  // الحصول على جميع الحملات
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على حملات المشروع
  async getProjectCampaigns(projectId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns/project/${projectId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على حملة بالـ ID
  async getById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء حملة جديدة
  async create(campaignData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(campaignData),
    });

    return handleResponse(response);
  },

  // تحديث حملة
  async update(id: string, campaignData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(campaignData),
    });

    return handleResponse(response);
  },

  // حذف حملة
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // إضافة KPI للحملة
  async addKpi(id: string, name: string, value: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}/kpis`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ name, value }),
    });

    return handleResponse(response);
  },

  // تحديث KPI للحملة
  async updateKpi(id: string, kpiIndex: number, name: string, value: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}/kpis/${kpiIndex}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ name, value }),
    });

    return handleResponse(response);
  },
};

// Contents API
export const contentsAPI = {
  // الحصول على جميع المحتوى
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على تقويم المحتوى
  async getCalendar(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/contents/calendar`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على محتوى المشروع
  async getProjectContents(projectId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/contents/project/${projectId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على محتوى بالـ ID
  async getById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء محتوى جديد
  async create(contentData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(contentData),
    });

    return handleResponse(response);
  },

  // تحديث محتوى
  async update(id: string, contentData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(contentData),
    });

    return handleResponse(response);
  },

  // حذف محتوى
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // إضافة تعليق للمحتوى
  async addComment(id: string, text: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}/comments`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ text }),
    });

    return handleResponse(response);
  },
};

// Calendar API
export const calendarAPI = {
  // الحصول على بيانات التقويم
  async getCalendarData(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/calendar`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على العناصر القادمة
  async getUpcoming(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/calendar/upcoming`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على عناصر تاريخ محدد
  async getByDate(date: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/calendar/${date}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },
};

// Client Portal API
export const clientPortalAPI = {
  // لوحة تحكم العميل
  async getDashboard(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/client-portal/dashboard`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },

  // مشاريع العميل
  async getProjects(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/client-portal/projects`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },

  // تفاصيل مشروع العميل
  async getProject(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/client-portal/projects/${id}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },

  // إشعارات العميل
  async getNotifications(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/client-portal/notifications`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },
};

// Permissions API
export const permissionsAPI = {
  // الحصول على جميع الصلاحيات
  async getAll(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على جميع الأدوار
  async getAllRoles(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/permissions/roles`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على صلاحيات دور معين
  async getRolePermissions(role: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/permissions/role/${role}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // تحديث صلاحية واحدة
  async updatePermission(role: string, column: string, canEdit: boolean): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/permissions/update`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ role, column, can_edit: canEdit }),
    });

    return handleResponse(response);
  },

  // تحديث صلاحيات متعددة
  async bulkUpdate(permissions: Array<{ role: string; column: string; can_edit: boolean }>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/permissions/bulk-update`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ permissions }),
    });

    return handleResponse(response);
  },

  // إعادة تعيين للافتراضية
  async resetToDefault(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/permissions/reset`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إضافة دور مخصص
  async addCustomRole(roleData: { name: string; label: string; emoji: string; created_by: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/permissions/roles`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(roleData),
    });

    return handleResponse(response);
  },

  // تحديث دور مخصص
  async updateCustomRole(id: string, roleData: { label?: string; emoji?: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/permissions/roles/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(roleData),
    });

    return handleResponse(response);
  },

  // حذف دور مخصص
  async deleteCustomRole(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/permissions/roles/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },
};

// Health Check API
export const healthAPI = {
  // فحص صحة النظام
  async check(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return handleResponse(response);
  },
};

// تصدير جميع APIs
export const api = {
  auth: authAPI,
  users: usersAPI,
  clients: clientsAPI,
  projects: projectsAPI,
  tasks: tasksAPI,
  campaigns: campaignsAPI,
  contents: contentsAPI,
  calendar: calendarAPI,
  clientPortal: clientPortalAPI,
  permissions: permissionsAPI,
  health: healthAPI,
};

export default api;
