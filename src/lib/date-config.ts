// Date and Time Configuration for Egypt Timezone

export const DATE_CONFIG = {
  timezone: 'Africa/Cairo',
  locale: 'en-US',
  arabicLocale: 'ar-EG',
  
  // Default date format options
  dateFormat: {
    year: 'numeric' as const,
    month: 'short' as const,
    day: 'numeric' as const,
    timeZone: 'Africa/Cairo' as const,
  },
  
  // Default datetime format options
  dateTimeFormat: {
    year: 'numeric' as const,
    month: 'short' as const,
    day: 'numeric' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    hour12: true as const,
    timeZone: 'Africa/Cairo' as const,
  },
  
  // Full datetime with timezone
  fullDateTimeFormat: {
    weekday: 'short' as const,
    year: 'numeric' as const,
    month: 'short' as const,
    day: 'numeric' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    hour12: true as const,
    timeZone: 'Africa/Cairo' as const,
    timeZoneName: 'short' as const,
  },
  
  // Time only format
  timeFormat: {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    hour12: true as const,
    timeZone: 'Africa/Cairo' as const,
  },
  
  // Short date format (MM/DD/YYYY)
  shortDateFormat: {
    month: '2-digit' as const,
    day: '2-digit' as const,
    year: 'numeric' as const,
    timeZone: 'Africa/Cairo' as const,
  },
  
  // Arabic date format
  arabicDateFormat: {
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const,
    timeZone: 'Africa/Cairo' as const,
  },
};

// Helper to get current Egypt time
export function getCurrentEgyptTime(): Date {
  const now = new Date();
  const egyptTimeString = now.toLocaleString('en-US', { timeZone: DATE_CONFIG.timezone });
  return new Date(egyptTimeString);
}

// Helper to check if date is in Egypt timezone
export function isEgyptTimezone(): boolean {
  return Intl.DateTimeFormat().resolvedOptions().timeZone === DATE_CONFIG.timezone;
}

