import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

export const USER_MENU_ITEMS = [
  {
    label: 'Profile',
    key: 'profile',
    icon: <UserOutlined />,
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: <SettingOutlined />,
  },
  {
    type: 'divider',
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: <LogoutOutlined />,
    danger: true,
  },
];
