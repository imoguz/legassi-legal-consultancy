'use client';

import { useState } from 'react';
import {
  List,
  Card,
  Button,
  Tag,
  Progress,
  Space,
  Modal,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useGetTasksByMatterIdQuery } from '@/rtk/api/taskApi';
import dayjs from 'dayjs';

export default function TasksTab({ matter }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const { data: tasksData, isLoading } = useGetTasksByMatterIdQuery(matter._id);

  const tasks = tasksData || [];

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'blue',
      medium: 'orange',
      high: 'red',
      urgent: 'red',
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      'not-started': 'default',
      'in-progress': 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'not-started': <ClockCircleOutlined />,
      'in-progress': <ExclamationCircleOutlined />,
      completed: <CheckCircleOutlined />,
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;
  const completionRate =
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Task Summary */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Tasks</h3>
            <p className="text-gray-600">Manage matter-related tasks</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            New Task
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Task Completion</span>
            <span>
              {completedTasks} of {tasks.length} tasks
            </span>
          </div>
          <Progress
            percent={Math.round(completionRate)}
            status={completionRate === 100 ? 'success' : 'active'}
          />
        </div>
      </Card>

      {/* Tasks List */}
      <Card>
        <List
          loading={isLoading}
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button
                  key={`view-${task._id}`}
                  type="link"
                  onClick={() => setSelectedTask(task)}
                >
                  View Details
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getStatusIcon(task.status)}
                title={
                  <div className="flex items-center gap-2">
                    <span>{task.title}</span>
                    <Tag color={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Tag>
                  </div>
                }
                description={
                  <Space direction="vertical" size="small">
                    <div className="text-gray-600">{task.description}</div>
                    <div className="text-xs text-gray-500">
                      Due:{' '}
                      {task.dueDate
                        ? dayjs(task.dueDate).format('MMM D, YYYY')
                        : 'No due date'}
                      {task.assignedTo &&
                        ` • Assigned to: ${task.assignedTo.firstname} ${task.assignedTo.lastname}`}
                    </div>
                  </Space>
                }
              />
              <Tag color={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Tag>
            </List.Item>
          )}
          locale={{ emptyText: 'No tasks created yet' }}
        />
      </Card>

      {/* Task Detail Modal */}
      <Modal
        title="Task Details"
        open={!!selectedTask}
        onCancel={() => setSelectedTask(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedTask(null)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedTask && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Title">
              {selectedTask.title}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedTask.description || 'No description'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedTask.status)}>
                {selectedTask.status.replace('-', ' ')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {selectedTask.dueDate
                ? dayjs(selectedTask.dueDate).format('MMM D, YYYY')
                : 'No due date'}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned To">
              {selectedTask.assignedTo
                ? `${selectedTask.assignedTo.firstname} ${selectedTask.assignedTo.lastname}`
                : 'Unassigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {dayjs(selectedTask.createdAt).format('MMM D, YYYY h:mm A')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
