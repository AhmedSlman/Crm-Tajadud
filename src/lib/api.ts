// API Client للتعامل مع Laravel Backend
import { AuthUser, LoginCredentials, RegisterData, ClientUser, User, Client, Project, Task, Campaign, Content, ClientProjectView, ClientNotification } from '@/types';
import config from './config';

const API_BASE_URL = config.api.baseUrl;

// Helper function للتحويل من camelCase إلى snake_case
const toSnakeCase = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  
  const snakeObj: Record<string, unknown> = {};
  
  // Special mapping for fields that need _id suffix
  const idFieldMap: Record<string, string> = {
    'clientId': 'client_id',
    'projectId': 'project_id',
    'projectManager': 'project_manager_id',
    'assignedTo': 'assigned_to',
    'campaignId': 'campaign_id',
    'responsiblePerson': 'responsible_person_id',
  };
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined values
    if (value === undefined) continue;
    
    // Use special mapping if available, otherwise convert to snake_case
    const snakeKey = idFieldMap[key] || key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeObj[snakeKey] = toSnakeCase(value);
  }
  return snakeObj;
};

// Helper function لحفظ الـ token في cookies و localStorage
const saveToken = (token: string, isClient = false): void => {
  if (typeof window === 'undefined') return;
  
  const tokenKey = isClient ? 'clientToken' : 'token';
  
  // حفظ في localStorage
  localStorage.setItem(tokenKey, token);
  
  // حفظ في cookies
  document.cookie = `${tokenKey}=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;
};

// Helper function لحذف الـ token من cookies و localStorage
const removeToken = (isClient = false): void => {
  if (typeof window === 'undefined') return;
  
  const tokenKey = isClient ? 'clientToken' : 'token';
  
  // حذف من localStorage
  localStorage.removeItem(tokenKey);
  
  // حذف من cookies
  document.cookie = `${tokenKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

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
const handleResponse = async (response: Response, options?: { silent404?: boolean }) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Debug log
    if (response.status === 422 || response.status === 403) {
      console.log('Error response:', errorData);
    }
    
    // استخراج رسالة الخطأ من Laravel
    let errorMessage = errorData.error || errorData.message;
    
    // معالجة أخطاء Laravel Validation
    if (errorData.errors) {
      // إذا كان هناك أخطاء validation متعددة
      const firstError = Object.values(errorData.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        errorMessage = firstError[0];
      }
    }
    
    // معالجة أخطاء قاعدة البيانات
    if (errorMessage && typeof errorMessage === 'string') {
      // Duplicate entry error
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('email')) {
        errorMessage = 'This email address is already registered';
      }
      // Foreign key constraint
      else if (errorMessage.includes('foreign key constraint')) {
        errorMessage = 'Cannot delete: This item is being used by other records';
      }
      // Unique constraint
      else if (errorMessage.includes('unique constraint')) {
        errorMessage = 'This value already exists in the system';
      }
    }
    
    // If silent404 is enabled and it's a 404, treat as success (item already deleted)
    if (options?.silent404 && response.status === 404) {
      return { success: true, message: 'Item already deleted' };
    }
    
    throw new Error(errorMessage || `HTTP ${response.status}`);
  }
  
  // Handle empty responses (like DELETE operations)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return { success: true };
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
    
    // حفظ التوكن في localStorage و cookies
    if (data.token) {
      saveToken(data.token, false);
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
    
    // حفظ التوكن في localStorage و cookies
    if (data.token) {
      saveToken(data.token, true);
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
    
    // مسح البيانات المحلية من localStorage و cookies
    if (isClient) {
      removeToken(true);
      localStorage.removeItem('clientUser');
    } else {
      removeToken(false);
      localStorage.removeItem('user');
    }
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatar: string; avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
    });

    return handleResponse(response);
  },

  // Delete avatar
  async deleteAvatar(): Promise<{ avatar: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    return handleResponse(response);
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
  async updateProfile(profileData: Partial<User | ClientUser>, isClient = false): Promise<{ message: string; user: AuthUser | ClientUser }> {
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
  async getAuthStats(): Promise<Record<string, unknown>> {
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
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مستخدم بالـ ID
  async getById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء مستخدم جديد
  async create(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(userData)),
    });

    return handleResponse(response);
  },

  // تحديث مستخدم
  async update(id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(userData)),
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
  async getPending(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/pending`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الموافقة على مستخدم
  async approve(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/approve`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // رفض مستخدم
  async reject(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reject`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // تعليق مستخدم
  async suspend(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/suspend`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // تفعيل مستخدم
  async activate(id: string): Promise<User> {
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
  async getAll(): Promise<Client[]> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على عميل بالـ ID
  async getById(id: string): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء عميل جديد
  async create(clientData: Partial<Client>): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(clientData)),
    });

    return handleResponse(response);
  },

  // تحديث عميل
  async update(id: string, clientData: Partial<Client>): Promise<Client> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(clientData)),
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
  async getProjects(id: string): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}/projects`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء Client User (حساب دخول للعميل)
  async createUser(clientId: string, userData: { name: string; email: string; password: string; phone?: string }): Promise<ClientUser> {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/users`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  // الحصول على Client Users
  async getUsers(clientId: string): Promise<ClientUser[]> {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/users`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // حذف Client User
  async deleteUser(clientId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}/users/${userId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },
};

// Projects API
export const projectsAPI = {
  // الحصول على جميع المشاريع
  async getAll(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مشروع بالـ ID
  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء مشروع جديد
  async create(projectData: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(projectData)),
    });

    return handleResponse(response);
  },

  // تحديث مشروع
  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(projectData)),
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
  async getStats(id: string): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // رفع ملف للمشروع
  async uploadFile(id: string, file: File, name: string): Promise<{ url: string }> {
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
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مهامي
  async getMyTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/my-tasks`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مهام المشروع
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على مهمة بالـ ID
  async getById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء مهمة جديدة
  async create(taskData: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(taskData)),
    });

    return handleResponse(response);
  },

  // تحديث مهمة
  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(taskData)),
    });

    return handleResponse(response);
  },

  // حذف مهمة
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response, { silent404: true });
  },

  // إضافة تعليق للمهمة
  async addComment(id: string, text: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/comments`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ text }),
    });

    return handleResponse(response);
  },

  // إضافة مرفق للمهمة
  async addAttachment(id: string, file: File): Promise<{ url: string }> {
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
  async getAll(): Promise<Campaign[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على حملات المشروع
  async getProjectCampaigns(projectId: string): Promise<Campaign[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns/project/${projectId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على حملة بالـ ID
  async getById(id: string): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء حملة جديدة
  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(campaignData)),
    });

    return handleResponse(response);
  },

  // تحديث حملة
  async update(id: string, campaignData: Partial<Campaign>): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(campaignData)),
    });

    return handleResponse(response);
  },

  // حذف حملة
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response, { silent404: true });
  },

  // إضافة KPI للحملة
  async addKpi(id: string, name: string, value: string): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}/kpis`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ name, value }),
    });

    return handleResponse(response);
  },

  // تحديث KPI للحملة
  async updateKpi(id: string, kpiIndex: number, name: string, value: string): Promise<Campaign> {
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
  async getAll(): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على تقويم المحتوى
  async getCalendar(): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/contents/calendar`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على محتوى المشروع
  async getProjectContents(projectId: string): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/contents/project/${projectId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على محتوى بالـ ID
  async getById(id: string): Promise<Content> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إنشاء محتوى جديد
  async create(contentData: Partial<Content>): Promise<Content> {
    const response = await fetch(`${API_BASE_URL}/contents`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(contentData)),
    });

    return handleResponse(response);
  },

  // تحديث محتوى
  async update(id: string, contentData: Partial<Content>): Promise<Content> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(toSnakeCase(contentData)),
    });

    return handleResponse(response);
  },

  // حذف محتوى
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contents/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response, { silent404: true });
  },

  // إضافة تعليق للمحتوى
  async addComment(id: string, text: string): Promise<{ message: string }> {
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
  async getCalendarData(): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/calendar`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على العناصر القادمة
  async getUpcoming(): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/calendar/upcoming`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على عناصر تاريخ محدد
  async getByDate(date: string): Promise<Content[]> {
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
  async getDashboard(): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE_URL}/client-portal/dashboard`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },

  // مشاريع العميل
  async getProjects(): Promise<ClientProjectView[]> {
    const response = await fetch(`${API_BASE_URL}/client-portal/projects`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },

  // تفاصيل مشروع العميل
  async getProject(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/client-portal/projects/${id}`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    return handleResponse(response);
  },

  // إشعارات العميل
  async getNotifications(): Promise<ClientNotification[]> {
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
  async getAll(): Promise<Array<Record<string, unknown>>> {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على جميع الأدوار
  async getAllRoles(): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE_URL}/permissions/roles`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على صلاحيات دور معين
  async getRolePermissions(role: string): Promise<Array<Record<string, unknown>>> {
    const response = await fetch(`${API_BASE_URL}/permissions/role/${role}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // تحديث صلاحية واحدة
  async updatePermission(role: string, column: string, canEdit: boolean): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/permissions/update`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ role, column, can_edit: canEdit }),
    });

    return handleResponse(response);
  },

  // تحديث صلاحيات متعددة
  async bulkUpdate(permissions: Array<{ role: string; column: string; can_edit: boolean }>): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/permissions/bulk-update`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ permissions }),
    });

    return handleResponse(response);
  },

  // إعادة تعيين للافتراضية
  async resetToDefault(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/permissions/reset`, {
      method: 'POST',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // إضافة دور مخصص
  async addCustomRole(roleData: { name: string; label: string; emoji: string; created_by: string }): Promise<{ id: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/permissions/roles`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(roleData),
    });

    return handleResponse(response);
  },

  // تحديث دور مخصص
  async updateCustomRole(id: string, roleData: { label?: string; emoji?: string }): Promise<{ message: string }> {
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

  // الحصول على Matrix كامل
  async getMatrix(): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE_URL}/permissions/matrix`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // الحصول على الأعمدة المتاحة
  async getColumns(): Promise<Array<Record<string, unknown>>> {
    const response = await fetch(`${API_BASE_URL}/permissions/columns`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleResponse(response);
    return data.columns || [];
  },

  // حذف صلاحيات دور كامل
  async deleteRolePermissions(role: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/permissions/role/${role}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    await handleResponse(response);
  },

  // ============ Action Permissions ============
  
  // Get all action permissions
  async getActionPermissions(): Promise<Array<Record<string, unknown>>> {
    const response = await fetch(`${API_BASE_URL}/permissions/actions`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Get role action permissions
  async getRoleActionPermissions(role: string): Promise<Array<Record<string, unknown>>> {
    const response = await fetch(`${API_BASE_URL}/permissions/actions/role/${role}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    return handleResponse(response);
  },

  // Update action permission
  async updateActionPermission(role: string, resource: string, action: string, canPerform: boolean): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/permissions/actions/update`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ role, resource, action, can_perform: canPerform }),
    });

    return handleResponse(response);
  },

  // Check if can perform action
  async canPerform(role: string, resource: string, action: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/permissions/actions/can-perform`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ role, resource, action }),
    });

    const data = await handleResponse(response);
    return data.can_perform || false;
  },
};

// Health Check API
export const healthAPI = {
  // فحص صحة النظام
  async check(): Promise<{ status: string; message: string }> {
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
