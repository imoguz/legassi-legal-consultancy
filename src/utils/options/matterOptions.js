export const matterTypeOptions = [
  { value: 'lawsuit', label: 'Lawsuit' },
  { value: 'contract', label: 'Contract' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'other', label: 'Other' },
];

export const feeTypeOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'hourly', label: 'Hourly' },
];

export const teamMemberRoleOptions = [
  { value: 'co-counsel', label: 'Co-Counsel' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'intern', label: 'Intern' },
  { value: 'assistant', label: 'Assistant' },
];
// ----------------------------

import {
  TeamOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

export const VISIBILITY_OPTIONS = [
  {
    value: 'internal',
    label: 'Internal',
    icon: <EyeInvisibleOutlined />,
    description: 'Only internal team members',
  },
  {
    value: 'client',
    label: 'Client',
    icon: <EyeOutlined />,
    description: 'Visible to client and team',
  },
  {
    value: 'team',
    label: 'Team',
    icon: <TeamOutlined />,
    description: 'Visible to matter team only',
  },
  {
    value: 'restricted',
    label: 'Restricted',
    icon: <LockOutlined />,
    description: 'Only selected users',
  },
];

export const practiceAreaOptions = [
  { value: 'corporate', label: 'Corporate Law' },
  { value: 'litigation', label: 'Litigation' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'intellectual-property', label: 'Intellectual Property' },
  { value: 'employment', label: 'Employment Law' },
  { value: 'family', label: 'Family Law' },
  { value: 'criminal', label: 'Criminal Law' },
  { value: 'immigration', label: 'Immigration Law' },
  { value: 'bankruptcy', label: 'Bankruptcy' },
  { value: 'tax', label: 'Tax Law' },
  { value: 'estate-planning', label: 'Estate Planning' },
  { value: 'personal-injury', label: 'Personal Injury' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'other', label: 'Other' },
];

export const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'closed', label: 'Closed' },
];

export const stageOptions = [
  { value: 'intake', label: 'Intake' },
  { value: 'preparation', label: 'Preparation' },
  { value: 'filing', label: 'Filing' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'hearing', label: 'Hearing' },
  { value: 'trial', label: 'Trial' },
  { value: 'appeal', label: 'Appeal' },
  { value: 'complete', label: 'Complete' },
];

export const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const billingModelOptions = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'flat', label: 'Flat Fee' },
  { value: 'contingency', label: 'Contingency' },
  { value: 'mixed', label: 'Mixed' },
];

export const confidentialityOptions = [
  { value: 'private', label: 'Private' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'public', label: 'Public' },
];

export const teamRoleOptions = [
  { value: 'attorney', label: 'Attorney' },
  { value: 'partner', label: 'Partner' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'assistant', label: 'Legal Assistant' },
  { value: 'intern', label: 'Intern' },
  { value: 'manager', label: 'Case Manager' },
];
