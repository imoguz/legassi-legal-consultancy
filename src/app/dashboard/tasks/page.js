'use client';

import { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Badge,
  Tooltip,
  Typography,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/common/DataTable';
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useGetTaskStatsQuery,
  useGetTaskMattersQuery,
} from '@/rtk/api/taskApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import TaskModal from '@/components/tasks/TaskModal';
import { notify } from '@/utils/helpers';
import { useGetTaskFiltersQuery } from '@/rtk/api/filtersApi';

const { Text, Title } = Typography;

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

// STATUS TAG
const TaskStatusTag = ({ status }) => {
  const statusConfig = {
    open: { color: 'blue', text: 'Open' },
    'in-progress': { color: 'purple', text: 'In Progress' },
    waiting: { color: 'gold', text: 'Waiting' },
    completed: { color: 'green', text: 'Completed' },
    cancelled: { color: 'red', text: 'Cancelled' },
  };

  const config = statusConfig[status] || statusConfig.open;
  return <Tag color={config.color}>{config.text}</Tag>;
};

// PRIORITY BADGE
const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: { color: 'green', text: 'Low' },
    medium: { color: 'blue', text: 'Medium' },
    high: { color: 'orange', text: 'High' },
    urgent: { color: 'red', text: 'Urgent' },
  };
  const config = priorityConfig[priority] || priorityConfig.medium;
  return <Badge color={config.color} text={config.text} />;
};

// DUE DATE
const DueDateCell = ({ dueDate }) => {
  if (!dueDate) return <span className="text-gray-400">-</span>;

  const isOverdue = dayjs(dueDate).isBefore(dayjs());
  const dateText = dayjs(dueDate).format('MMM D, YYYY');

  return (
    <Tooltip title={dayjs(dueDate).format('MMM D, YYYY h:mm A')}>
      <div
        className={`flex items-center gap-1 ${
          isOverdue ? 'text-red-500 font-medium' : 'text-gray-600'
        }`}
      >
        <ClockCircleOutlined />
        <span>{dateText}</span>
      </div>
    </Tooltip>
  );
};

// MATTER CELL
const MatterCell = ({ matter }) => {
  if (!matter) return <span className="text-gray-400">-</span>;
  return (
    <Tooltip title={matter.title}>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 text-sm">
          {matter.matterNumber || 'No Number'}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {matter.title.length > 30
            ? `${matter.title.substring(0, 30)}...`
            : matter.title}
        </span>
      </div>
    </Tooltip>
  );
};

export default function TasksPage() {
  const router = useRouter();

  const [tableState, setTableState] = useState({
    offset: 0,
    searchText: '',
    filters: {},
    sorter: {},
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // API CALLS
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery({
    page: Math.floor(tableState.offset / 20) + 1,
    limit: 20,
    search: tableState.searchText,
    filters: tableState.filters,
    sortBy: tableState.sorter?.field,
    sortOrder: tableState.sorter?.order,
  });

  const { data: statsData } = useGetTaskStatsQuery();
  const { data: mattersData } = useGetTaskMattersQuery();
  const { data: filtersData, isLoading: fLoading } = useGetTaskFiltersQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const tasks = tasksData?.data || [];
  const totalTasks = tasksData?.pagination?.total || 0;

  const stats = {
    total: statsData?.total || 0,
    inProgress: statsData?.inProgress || 0,
    overdue: statsData?.overdue || 0,
    completed: statsData?.completed || 0,
  };

  // Row click
  const handleRowClick = (record) =>
    router.push(`/dashboard/tasks/${record._id}`);

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;

    Promise.all(selectedRowKeys.map((id) => deleteTask(id).unwrap()))
      .then(() => {
        notify.success(
          'Successful',
          `${selectedRowKeys.length} tasks deleted successfully`
        );
        setSelectedRowKeys([]);
      })
      .catch(() => {
        notify.error('Error', 'Failed to delete some tasks, please try again.');
      });
  };
  // BACKEND FILTERING
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: 240,
      render: (title, record) => (
        <Tooltip title={record.description || title}>
          <div className="flex flex-col cursor-pointer">
            <span className="font-medium text-gray-900 hover:text-blue-600">
              {title}
            </span>
            {record.description && (
              <span className="text-xs text-gray-500 truncate">
                {record.description.length > 60
                  ? `${record.description.substring(0, 60)}...`
                  : record.description}
              </span>
            )}
          </div>
        </Tooltip>
      ),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      filters: filtersData?.data?.status || [],
      render: (status) => <TaskStatusTag status={status} />,
    },

    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 120,
      filters: filtersData?.data?.priority || [],
      render: (priority) => <PriorityBadge priority={priority} />,
    },

    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      width: 140,
      sorter: true,
      filters: filtersData?.data?.dueDate || [],
      render: (dueDate) => <DueDateCell dueDate={dueDate} />,
    },

    {
      title: 'Assignees',
      dataIndex: 'assignees',
      width: 140,
      filters: filtersData?.data?.assignees || [],
      render: (assignees) => {
        if (!assignees || assignees.length === 0)
          return <span className="text-sm text-gray-400">Unassigned</span>;

        const primaryAssignee = assignees.find((a) => a.isPrimary);
        const otherCount = assignees.length - 1;
        const person = primaryAssignee || assignees[0];

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {person.user?.firstname} {person.user?.lastname}
            </span>
            {otherCount > 0 && (
              <span className="text-xs text-gray-500">
                + {otherCount} team member{otherCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        );
      },
    },

    {
      title: 'Matter',
      dataIndex: 'matter',
      width: 160,
      filters: filtersData?.data?.matters || [],
      render: (matter) => <MatterCell matter={matter} />,
    },
  ];

  const selectMenuItems = [
    {
      key: 'delete',
      label: (
        <Popconfirm
          title={`Delete ${selectedRowKeys.length} tasks`}
          description="Are you sure?"
          onConfirm={handleBulkDelete}
          okText="Yes"
          cancelText="No"
          okType="danger"
        >
          <span>
            <DeleteOutlined /> Delete {selectedRowKeys.length} selected
          </span>
        </Popconfirm>
      ),
      danger: true,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={3} className="m-0">
            Tasks
          </Title>
          <Text type="secondary">
            Manage and track all legal tasks and assignments
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          New Task
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="small">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UnorderedListOutlined className="text-blue-500 text-lg" />
            </div>
          </div>
        </Card>

        <Card size="small">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-amber-500">
                {stats.inProgress}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <ClockCircleOutlined className="text-amber-500 text-lg" />
            </div>
          </div>
        </Card>

        <Card size="small">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ClockCircleOutlined className="text-red-500 text-lg" />
            </div>
          </div>
        </Card>

        <Card size="small">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleOutlined className="text-green-600 text-lg" />
            </div>
          </div>
        </Card>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        dataSource={tasks}
        loading={tasksLoading}
        total={totalTasks}
        tableState={tableState}
        setTableState={setTableState}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        selectMenuItems={selectMenuItems}
        showSearchInput
        onRowClick={handleRowClick}
        pageSize={20}
        rowKey="_id"
        scroll={{ x: 1000 }}
      />

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode="create"
      />
    </div>
  );
}
