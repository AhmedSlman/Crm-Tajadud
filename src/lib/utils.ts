// Utility functions

// Egypt timezone constant
export const EGYPT_TIMEZONE = 'Africa/Cairo';

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: EGYPT_TIMEZONE
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: EGYPT_TIMEZONE
  });
}

// Format date in Arabic (Egyptian) style
export function formatDateArabic(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: EGYPT_TIMEZONE
  });
}

// Format full date and time with timezone info
export function formatFullDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: EGYPT_TIMEZONE,
    timeZoneName: 'short'
  });
}

// Format time only (Egypt timezone)
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: EGYPT_TIMEZONE
  });
}

// Format short date (e.g., "12/25/2024")
export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: EGYPT_TIMEZONE
  });
}

// Get date string in YYYY-MM-DD format (Egypt timezone)
// This is crucial for calendar date matching
export function getDateString(date: string | Date): string {
  const d = new Date(date);
  // Use Egypt timezone to get the correct date
  const egyptDateStr = d.toLocaleDateString('en-CA', {
    timeZone: EGYPT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return egyptDateStr; // Returns "YYYY-MM-DD" in Egypt timezone
}

// Parse publish date and get date string
export function getPublishDateString(publishDate: string | null | undefined): string | null {
  if (!publishDate) return null;
  
  // Handle different formats: "YYYY-MM-DD" or "YYYY-MM-DD HH:MM:SS"
  const dateOnly = publishDate.split(' ')[0].split('T')[0];
  return dateOnly;
}

// Get today's date in YYYY-MM-DD format (Egypt timezone)
export function getTodayString(): string {
  const now = new Date();
  return now.toLocaleDateString('en-CA', {
    timeZone: EGYPT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Get tomorrow's date in YYYY-MM-DD format (Egypt timezone)
export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-CA', {
    timeZone: EGYPT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Get date N days from now in YYYY-MM-DD format (Egypt timezone)
export function getDateAfterDays(days: number): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return futureDate.toLocaleDateString('en-CA', {
    timeZone: EGYPT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Get current timestamp in ISO format (Egypt timezone aware)
// For createdAt, updatedAt fields
export function getCurrentTimestamp(): string {
  // Get current time in Egypt
  const now = new Date();
  const egyptTimeStr = now.toLocaleString('en-US', { timeZone: EGYPT_TIMEZONE });
  const egyptDate = new Date(egyptTimeStr);
  
  // Return ISO string of Egypt time
  return egyptDate.toISOString();
}

// Convert UTC date to Egypt timezone
export function toEgyptTime(date: string | Date): Date {
  const utcDate = new Date(date);
  // Create a date string in Egypt timezone
  const egyptDateString = utcDate.toLocaleString('en-US', { timeZone: EGYPT_TIMEZONE });
  return new Date(egyptDateString);
}

export function getDaysUntil(date: string | Date): number {
  // Get current time in Egypt timezone
  const now = toEgyptTime(new Date());
  const target = toEgyptTime(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getRelativeTime(date: string | Date): string {
  const days = getDaysUntil(date);
  
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days} days`;
  if (days <= 30) return `Due in ${Math.floor(days / 7)} weeks`;
  return `Due in ${Math.floor(days / 30)} months`;
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function searchInObject(obj: Record<string, unknown>, query: string): boolean {
  const searchQuery = query.toLowerCase();
  
  return Object.values(obj).some(value => {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchQuery);
    }
    if (typeof value === 'number') {
      return value.toString().includes(searchQuery);
    }
    if (Array.isArray(value)) {
      return value.some(item => 
        typeof item === 'string' && item.toLowerCase().includes(searchQuery)
      );
    }
    return false;
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

