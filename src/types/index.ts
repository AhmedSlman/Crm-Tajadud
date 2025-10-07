export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  company: string;
  notes: string;
  linkedProjects: string[];
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  projectManager: string;
  createdBy: string;
  linkedTasks: string[];
  linkedCampaigns: string[];
  linkedContent: string[];
  progress: number;
  files: ProjectFile[];
  createdAt: string;
};

export type ProjectFile = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type TaskType = 'content-writing' | 'graphic-design' | 'video-editing' | 'ads-setup' | 'seo' | 'reporting' | 'general';
export type TaskStatus = 'to-do' | 'in-progress' | 'review' | 'done' | 'delayed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  assignedTo: string;
  createdBy: string;
  startDate: string;
  dueDate: string;
  completionDate?: string;
  attachments: Attachment[];
  comments: Comment[];
  progress: number;
  subtasks: Subtask[];
  projectId?: string;
  createdAt: string;
  changeLog: ChangeLog[];
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type ChangeLog = {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
};

export type CampaignType = 'facebook-ads' | 'instagram-ads' | 'google-ads' | 'linkedin-ads' | 'email-marketing' | 'offline-campaign';
export type CampaignObjective = 'awareness' | 'engagement' | 'leads' | 'sales';
export type CampaignStatus = 'planned' | 'running' | 'paused' | 'completed';

export type Campaign = {
  id: string;
  name: string;
  projectId: string;
  type: CampaignType;
  objective: CampaignObjective;
  startDate: string;
  endDate: string;
  budget: number;
  status: CampaignStatus;
  responsiblePerson: string;
  kpis: KPI[];
  attachments: Attachment[];
  createdBy: string;
  progress: number;
  createdAt: string;
};

export type KPI = {
  name: string;
  value: string;
};

export type ContentType = 'post' | 'video' | 'article' | 'graphic' | 'email' | 'other';
export type ContentStatus = 'idea' | 'in-progress' | 'review' | 'approved' | 'scheduled' | 'published';

export type ProjectStatus = 'planned' | 'in-progress' | 'completed' | 'on-hold';

export type Content = {
  id: string;
  title: string;
  contentType: ContentType;
  projectId?: string;
  campaignId?: string;
  status: ContentStatus;
  assignedTo: string;
  createdBy: string;
  startDate: string;
  dueDate: string;
  publishDate?: string;
  priority: Priority;
  attachments: Attachment[];
  comments: Comment[];
  progress: number;
  createdAt: string;
  // Content Plan specific fields
  designBrief?: string;
  inspiration?: string;
  design?: string;
  textContent?: string;
  driveLink?: string;
  notes?: string;
  month?: string; // Which month this content belongs to
  isReel?: boolean; // Is this a reel or regular content
  readyForCalendar?: boolean; // Ready to be dragged to social calendar
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
};

export type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  replies?: Comment[];
};

export type Notification = {
  id: string;
  type: 'task-created' | 'status-update' | 'deadline' | 'comment' | 'assignment';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

export type UserRole = 
  | 'admin' 
  | 'account-manager'
  | 'graphic-designer' 
  | 'social-media' 
  | 'content-writer' 
  | 'video-editor' 
  | 'ads-specialist'
  | 'seo-specialist'
  | string; // Allow custom roles

export type CustomRole = {
  id: string;
  name: string; // e.g., "project-manager"
  label: string; // e.g., "Project Manager"
  emoji: string; // e.g., "📋"
  isCustom: boolean;
  createdAt: string;
  createdBy: string;
};

export type UserStatus = 'pending' | 'active' | 'suspended';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for backend, never exposed to frontend
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  joinedAt: string;
  approvedBy?: string;
  approvedAt?: string;
};

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  company: string;
  avatar: string;
  clientId: string; // Links to Client record
  status: 'active' | 'suspended';
  joinedAt: string;
  lastLogin?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  token?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
};

export type ClientProjectView = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  projectManager: string;
  totalTasks: number;
  completedTasks: number;
  totalContent: number;
  publishedContent: number;
  activeCampaigns: number;
  nextDeadline?: string;
};

export type ClientNotification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'update';
  projectId?: string;
  read: boolean;
  createdAt: string;
};

export type ColumnName = 
  | 'design-brief'
  | 'inspiration'
  | 'design'
  | 'text-content'
  | 'drive-link'
  | 'notes'
  | 'status';

export type RolePermission = {
  role: UserRole;
  column: ColumnName;
  canEdit: boolean;
};

export type PermissionsConfig = {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  createdAt: string;
  updatedAt: string;
};

// Action-based permissions
export type ResourceType = 'tasks' | 'content' | 'campaigns' | 'projects' | 'clients' | 'users';
export type ActionType = 'create' | 'update' | 'delete' | 'view';

export type ActionPermission = {
  role: UserRole;
  resource: ResourceType;
  action: ActionType;
  canPerform: boolean;
};

// Messages Types
export type MessageSenderType = 'user' | 'client';

export type MessageSender = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  company?: string;
  type: MessageSenderType;
};

export type Message = {
  id: string;
  projectId: string;
  message: string;
  senderType: MessageSenderType;
  sender: MessageSender | null;
  attachments: Attachment[];
  read: boolean;
  readAt?: string;
  createdAt: string;
};

// My Work Types
export type WorkItemType = 'task' | 'content';

export type WorkItem = {
  id: string;
  title: string;
  description?: string;
  type: WorkItemType;
  taskType?: TaskType;
  contentType?: ContentType;
  status: TaskStatus | ContentStatus;
  priority: Priority;
  progress: number;
  dueDate: string;
  publishDate?: string;
  startDate: string;
  projectId?: string;
  projectName?: string;
  isReel?: boolean;
  createdAt: string;
};

export type MyWorkStats = {
  total: number;
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    delayed: number;
    overdue: number;
  };
  content: {
    total: number;
    idea: number;
    inProgress: number;
    review: number;
    approved: number;
    scheduled: number;
    published: number;
  };
  priority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  dueToday: number;
  dueThisWeek: number;
};

