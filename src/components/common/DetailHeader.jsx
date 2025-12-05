'use client';

import React from 'react';
import { Button, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function DetailHeader({
  title,
  subTitle,
  backUrl,
  editUrl,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button
          type="text"
          icon={<LeftOutlined className="text-lg h-9" />}
          onClick={() => (backUrl ? router.push(backUrl) : router.back())}
        />
        <div>
          <Title
            level={3}
            className="truncate overflow-hidden text-ellipsis whitespace-nowrap m-0 w-full sm:max-w-[400px] md:max-w-[600px]"
          >
            {title}
          </Title>
          {subTitle && (
            <Text
              type="secondary"
              className="truncate overflow-hidden text-ellipsis whitespace-nowrap m-0 w-full sm:max-w-[400px] md:max-w-[600px]"
            >
              {subTitle}
            </Text>
          )}
        </div>
      </div>
      <Space wrap>
        {editUrl && (
          <Link href={editUrl}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
        )}

        {onEdit && (
          <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
            Edit
          </Button>
        )}

        {onDelete && (
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
              Delete
            </Button>
          </Popconfirm>
        )}
      </Space>
    </div>
  );
}
