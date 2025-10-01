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
  | 'graphic-designer' 
  | 'social-media' 
  | 'content-writer' 
  | 'video-editor' 
  | 'ads-specialist'
  | 'seo-specialist';

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

