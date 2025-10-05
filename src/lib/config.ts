// Configuration file for the frontend application

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://crm-api.tajadud.org/public/api',
    timeout: 10000, // 10 seconds
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'CRM System',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: 'Complete CRM solution for digital marketing agencies',
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'token',
    userKey: 'user',
    clientTokenKey: 'clientToken',
    clientUserKey: 'clientUser',
    tokenValidationInterval: 5 * 60 * 1000, // 5 minutes
  },

  // Storage Configuration
  storage: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#563EB7',
      secondary: '#7c5fdc',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out',
    },
  },

  // Development Configuration
  dev: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enableMockData: false, // Set to true to use mock data instead of API
  },
};

export default config;
