'use client';

import { Modal, Descriptions, Tag, Typography, Skeleton } from 'antd';
import { useGetTaskByIdQuery } from '@/rtk/api/taskApi';
import dayjs from 'dayjs';

const { Paragraph, Text } = Typography;

export default function TaskDetailModal({ taskId, open, onClose }) {
  const { data: task, isLoading } = useGetTaskByIdQuery(taskId, {
    skip: !taskId,
  });

  const getPriorityTag = (priority) => {
    const color =
      priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green';
    return <Tag color={color}>{priority}</Tag>;
  };

  const getStatusTag = (status) => {
    const map = { open: 'blue', 'in-progress': 'gold', closed: 'green' };
    return <Tag color={map[status] || 'default'}>{status}</Tag>;
  };

  return (
    <Modal
      title="Task Detail"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {isLoading || !task ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Descriptions
          column={1}
          bordered
          size="small"
          styles={{ label: { width: '200px' } }}
        >
          <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {task.description ? (
              <Paragraph className="whitespace-pre-line">
                {task.description}
              </Paragraph>
            ) : (
              <Text type="secondary">No description provided</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {getPriorityTag(task.priority)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {getStatusTag(task.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Assigned To">
            {task.assignedTo
              ? `${task.assignedTo.firstname} ${task.assignedTo.lastname}`
              : 'Unassigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Due Date">
            {task.dueDate ? dayjs(task.dueDate).format('MMM D, YYYY') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(task.createdAt).format('MMM D, YYYY h:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {dayjs(task.updatedAt).format('MMM D, YYYY h:mm A')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
