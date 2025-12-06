'use client';

import { Descriptions, Typography } from 'antd';
const { Paragraph } = Typography;

export default function ClientInfoTab({ client }) {
  if (!client) return 'No client info available.';

  return (
    <Descriptions bordered column={1} size="small">
      <Descriptions.Item label="Name">{client.fullName}</Descriptions.Item>
      <Descriptions.Item label="Email">{client.email}</Descriptions.Item>
      <Descriptions.Item label="Address">
        {client.address || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="Type">{client.type || '-'}</Descriptions.Item>
      <Descriptions.Item label="Notes">
        {client.notes ? <Paragraph>{client.notes}</Paragraph> : '-'}
      </Descriptions.Item>
    </Descriptions>
  );
}
