export const notificationTypes = [
  {
    key: 'task',
    label: 'Tasks',
    description: 'Task assignments, updates, and deadlines',
  },
  {
    key: 'matter',
    label: 'Matters',
    description: 'Case updates and matter-related activities',
  },
  {
    key: 'calendar',
    label: 'Calendar',
    description: 'Event reminders and schedule changes',
  },
  {
    key: 'document',
    label: 'Documents',
    description: 'Document uploads and modifications',
  },
  {
    key: 'system',
    label: 'System',
    description: 'Platform updates and system notifications',
  },
  {
    key: 'reminder',
    label: 'Reminders',
    description: 'Deadline reminders and follow-ups',
  },
];

export const priorityLevels = [
  {
    key: 'urgent',
    label: 'Urgent',
    description: 'Critical alerts requiring immediate attention',
    border: { border: '1px solid #DC2626' },
  },
  {
    key: 'high',
    label: 'High',
    description: 'Important notifications for timely action',
    border: { border: '1px solid #F97316' },
  },
  {
    key: 'medium',
    label: 'Medium',
    description: 'Standard priority updates and information',
    border: { border: '1px solid #EAB308' },
  },
  {
    key: 'low',
    label: 'Low',
    description: 'Informational updates and general notices',
    border: { border: '1px solid #3B82F6' },
  },
];
