import {
  PieChartOutlined,
  FileOutlined,
  BarChartOutlined,
  WechatWorkOutlined,
  CalendarOutlined,
  BarsOutlined,
  TeamOutlined,
  AimOutlined,
  FileSearchOutlined,
  SafetyOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

export const getSidebarItems = (role) => {
  const baseItems = [
    {
      key: '',
      icon: <PieChartOutlined />,
      label: <span id="menu-dashboard">Dashboard</span>,
    },
    {
      key: 'matters',
      icon: <AimOutlined />,
      label: <span id="menu-matters">Matters</span>,
    },
    {
      key: 'contacts',
      icon: <TeamOutlined />,
      label: <span id="menu-contacts">Contacts</span>,
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: <span id="menu-calendar">Calendar</span>,
    },
    {
      key: 'tasks',
      icon: <BarsOutlined />,
      label: <span id="menu-tasks">Tasks</span>,
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: <span id="menu-reports">Reports</span>,
    },
    {
      key: 'document-search',
      icon: <FileSearchOutlined />,
      label: <span id="menu-ai-document-search">Document Search</span>,
    },
    {
      key: 'legal-assistant',
      icon: <WechatWorkOutlined />,
      label: <span id="menu-legal-assistant">Legal Assistant</span>,
    },
  ];

  if (role === 'admin') {
    baseItems.splice(6, 0, {
      key: 'admin',
      icon: <SafetyOutlined />,
      label: <span id="menu-admin">Admin Panel</span>,
      children: [
        {
          key: 'admin/documents',
          icon: <FileOutlined />,
          label: <span id="menu-admin-documents">Document</span>,
        },
        {
          key: 'admin/users',
          icon: <UserOutlined />,
          label: <span id="menu-admin-users">Users</span>,
        },
        {
          key: 'admin/employees',
          icon: <UsergroupAddOutlined />,
          label: <span id="menu-admin-employees">Employees</span>,
        },
      ],
    });
  }

  return baseItems;
};
