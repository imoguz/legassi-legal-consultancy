import { Avatar, Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import {
  CloseOutlined,
  SaveTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  FilePdfOutlined,
  FileImageOutlined,
  FileUnknownOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  employeeDepartmentColors,
  employeePositionColors,
  employeeStatusColors,
  positionColors,
  roleColors,
  statusColorMap,
  stageColorMap,
  priorityColorMap,
} from './antdTagColors';
import {
  employeeDepartmentOptions,
  employeePositionOptions,
  employeeStatusOptions,
} from '../options';
import dayjs from 'dayjs';

// Matter
// export const matterColumns = [
//   {
//     title: 'Matter #',
//     dataIndex: 'matterNumber',
//     sorter: true,
//   },
//   {
//     title: 'Title',
//     dataIndex: 'title',
//     sorter: true,
//   },
//   {
//     title: 'Status',
//     dataIndex: 'status',
//     filters: [
//       { text: 'Open', value: 'open' },
//       { text: 'In Progress', value: 'in-progress' },
//       { text: 'Closed', value: 'closed' },
//     ],
//     render: (status) => {
//       const color =
//         status === 'open'
//           ? 'success'
//           : status === 'in-progress'
//           ? 'processing'
//           : 'red';
//       return <Tag color={color}>{status?.toUpperCase()}</Tag>;
//     },
//   },
//   {
//     title: 'Client',
//     dataIndex: ['client', 'fullName'],
//     render: (client) => client || '-',
//   },
//   {
//     title: 'Attorney',
//     dataIndex: ['assignedAttorney'],
//     render: (attorney) =>
//       attorney ? `${attorney.firstname} ${attorney.lastname}` : 'Unassigned',
//   },
//   {
//     title: 'Start Date',
//     dataIndex: ['importantDates', 'openingDate'],
//     sorter: true,
//     render: (date) => (date ? new Date(date).toLocaleDateString() : '-'),
//   },
// ];
export const matterColumns = [
  {
    title: 'Matter Number',
    dataIndex: 'matterNumber',
    key: 'matterNumber',
    sorter: true,
    render: (text) => <span className="font-mono text-blue-600">{text}</span>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    render: (text, record) => (
      <div>
        <div className="font-medium">{text}</div>
        <div className="text-xs text-gray-500">{record.practiceArea}</div>
      </div>
    ),
  },
  {
    title: 'Client',
    dataIndex: 'client',
    key: 'client',
    render: (client) => client?.fullName || '-',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    render: (status) => (
      <Tag color={statusColorMap[status]}>
        {status?.replace('-', ' ').toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Stage',
    dataIndex: 'stage',
    key: 'stage',
    render: (stage) => (
      <Tag color={stageColorMap[stage]}>{stage?.toUpperCase()}</Tag>
    ),
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    sorter: true,
    render: (priority) => (
      <Tag color={priorityColorMap[priority]}>{priority?.toUpperCase()}</Tag>
    ),
  },
  {
    title: 'Primary Attorney',
    dataIndex: 'primaryAttorney',
    key: 'primaryAttorney',
    render: (attorney) =>
      attorney ? `${attorney.firstname} ${attorney.lastname}` : '-',
  },
  {
    title: 'Opening Date',
    dataIndex: 'dates',
    key: 'openingDate',
    sorter: true,
    render: (dates) =>
      dates?.openingDate
        ? new Date(dates.openingDate).toLocaleDateString()
        : '-',
  },
];

// Document
export const documentColumns = [
  {
    title: 'Title',
    dataIndex: 'title',
    sorter: true,
    width: 300,
    render: (text) => (
      <Tooltip title={text}>
        <span className="line-clamp-2">{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: 300,
    render: (text) => (
      <Tooltip title={text}>
        <span className="line-clamp-2">{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    sorter: true,
  },
  {
    title: 'Uploaded By',
    dataIndex: 'uploadedBy',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    sorter: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
];

// Admin/users
export const getUsersColumns = (
  editingKey,
  setEditingKey,
  handleSave,
  handleDelete,
  form
) => [
  {
    title: 'Full Name',
    dataIndex: ['firstname', 'lastname'],
    sorter: true,
    render: (_, record) => `${record.firstname} ${record.lastname}`,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: true,
    render: (text) => (
      <Tooltip title={text}>
        <span className="line-clamp-2">{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    sorter: true,
    editable: true,
    render: (role) => (
      <Tag className="capitalize" color={roleColors[role] || 'default'}>
        {role}
      </Tag>
    ),
  },
  {
    title: 'Position',
    dataIndex: 'position',
    sorter: true,
    editable: true,
    render: (pos) => (
      <Tag className="capitalize" color={positionColors[pos] || 'default'}>
        {pos || 'null'}
      </Tag>
    ),
  },
  {
    title: 'Verified',
    dataIndex: 'isVerified',
    filters: [
      { text: 'Verified', value: true },
      { text: 'Unverified', value: false },
    ],
    editable: true,
    render: (verified) =>
      verified ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
  },
  {
    title: 'Active',
    dataIndex: 'isActive',
    filters: [
      { text: 'Active', value: true },
      { text: 'Inactive', value: false },
    ],
    editable: true,
    render: (active) =>
      active ? (
        <Tag color="cyan">Active</Tag>
      ) : (
        <Tag color="default">Inactive</Tag>
      ),
  },
  {
    title: 'Deleted',
    dataIndex: 'isDeleted',
    filters: [
      { text: 'Deleted', value: true },
      { text: 'Not Deleted', value: false },
    ],
    editable: true,
    render: (deleted) =>
      deleted ? <Tag color="red">Deleted</Tag> : <Tag color="blue">Active</Tag>,
  },
  {
    title: 'Action',
    dataIndex: 'operation',
    render: (_, record) => {
      const editable = editingKey === record._id;
      return editable ? (
        <span className="flex gap-2">
          <Button
            type="text"
            icon={<SaveTwoTone />}
            onClick={(e) => {
              e.stopPropagation();
              handleSave(record._id);
            }}
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setEditingKey('');
            }}
          />
        </span>
      ) : (
        <span className="flex gap-2">
          <Button
            type="text"
            icon={<EditTwoTone twoToneColor="#727272" />}
            disabled={editingKey !== ''}
            onClick={(e) => {
              e.stopPropagation();
              setEditingKey(record._id);
              form.setFieldsValue({
                ...record,
                position: record.position ?? null,
                role: record.role ?? undefined,
                isVerified: record.isVerified ?? false,
                isActive: record.isActive ?? false,
                isDeleted: record.isDeleted ?? false,
              });
            }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record._id);
            }}
            onCancel={(e) => {
              e?.stopPropagation();
            }}
          >
            <Button
              type="text"
              icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
              danger
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </span>
      );
    },
  },
];

// Employee Columns
export const employeeColumns = [
  {
    title: 'Profile',
    dataIndex: 'profileImage',
    key: 'profileImage',
    width: 70,
    render: (profileImage, record) => (
      <Avatar
        shape="square"
        src={profileImage?.url || undefined}
        alt={`${record.firstname} ${record.lastname}`}
      >
        {!profileImage?.url && record.firstname
          ? record.firstname.charAt(0).toUpperCase()
          : null}
      </Avatar>
    ),
  },
  {
    title: 'Full Name',
    dataIndex: ['firstname', 'lastname'],
    sorter: true,
    render: (_, record) => `${record.firstname} ${record.lastname}`,
  },

  {
    title: 'Department',
    dataIndex: 'department',
    sorter: true,
    render: (dept) => {
      const departmentLabels = Object.fromEntries(
        employeeDepartmentOptions.map((option) => [option.value, option.label])
      );
      return (
        <Tag color={employeeDepartmentColors[dept] || 'default'}>
          {departmentLabels[dept] || 'null'}
        </Tag>
      );
    },
  },
  {
    title: 'Position',
    dataIndex: 'position',
    sorter: true,
    render: (pos) => {
      const positionLabels = Object.fromEntries(
        employeePositionOptions.map((option) => [option.value, option.label])
      );
      return (
        <Tag color={employeePositionColors[pos] || 'default'}>
          {positionLabels[pos] || 'null'}
        </Tag>
      );
    },
  },
  {
    title: 'Employment Status',
    dataIndex: 'employmentStatus',
    sorter: true,
    render: (status) => {
      const statusLabels = Object.fromEntries(
        employeeStatusOptions.map((option) => [option.value, option.label])
      );
      return (
        <Tag color={employeeStatusColors[status] || 'default'}>
          {statusLabels[status] || 'null'}
        </Tag>
      );
    },
  },
];

// aiSearch Table Columns
export const getAiSearchColumns = (searchResults) => [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    filters: [
      ...Array.from(new Set(searchResults.map((r) => r.category))).map(
        (cat) => ({ text: cat, value: cat })
      ),
    ],
    onFilter: (value, record) => record.category === value,
    render: (cat) => <span>{cat}</span>,
  },
  {
    title: 'File Type',
    dataIndex: 'fileType',
    key: 'fileType',
    filters: [
      ...Array.from(new Set(searchResults.map((r) => r.fileType))).map(
        (ft) => ({ text: ft.split('/')[1] || ft, value: ft })
      ),
    ],
    onFilter: (value, record) => record.fileType === value,
    render: (ft) => {
      const ext = ft.split('/')[1] || ft;
      const lower = ext.toLowerCase();

      if (lower === 'pdf') {
        return (
          <Tag color="red">
            <FilePdfOutlined /> &nbsp;PDF
          </Tag>
        );
      } else if (['png', 'jpg', 'jpeg', 'gif'].includes(lower)) {
        return (
          <Tag color="blue">
            <FileImageOutlined /> &nbsp;Image
          </Tag>
        );
      }
      return (
        <Tag color="default">
          <FileUnknownOutlined /> &nbsp;{ext.toUpperCase()}
        </Tag>
      );
    },
  },

  {
    title: 'File Size (KB)',
    dataIndex: 'fileSize',
    key: 'fileSize',
    sorter: (a, b) => Number(a.fileSize) - Number(b.fileSize),
    render: (size) => `${Math.round(Number(size) / 1024)}`,
  },
  {
    title: 'Relevance Score',
    dataIndex: 'relevanceScore',
    key: 'relevanceScore',
    sorter: (a, b) => a.relevanceScore - b.relevanceScore,
    render: (score) => (
      <Tag color={score > 0.8 ? 'green' : score > 0.5 ? 'orange' : 'red'}>
        {(score * 100).toFixed(0)}%
      </Tag>
    ),
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) =>
      dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
  },
];

// Matter detail related task list
export const matterTaskList = [
  {
    title: 'Task',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    width: 300,
    render: (text) => (
      <Tooltip title={text}>
        <span className="line-clamp-1">{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    sorter: true,
    key: 'priority',
    render: (value) => {
      const color =
        value === 'high' ? 'red' : value === 'medium' ? 'orange' : 'green';
      return <Tag color={color}>{value}</Tag>;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: true,
    key: 'status',
    render: (value) => {
      const color =
        value === 'open' ? 'blue' : value === 'in-progress' ? 'gold' : 'green';
      return <Tag color={color}>{value}</Tag>;
    },
  },
  {
    title: 'Assigned To',
    dataIndex: 'assignedTo',
    sorter: true,
    key: 'assignedTo',
    render: (user) =>
      user ? `${user.firstname} ${user.lastname}` : 'Unassigned',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    sorter: true,
    key: 'dueDate',
    render: (date) =>
      date ? dayjs(date).format('MMM D, YYYY') : 'No deadline',
  },
];
