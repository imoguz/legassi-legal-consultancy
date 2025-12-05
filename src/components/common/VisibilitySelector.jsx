'use client';

import { Form, Select, Space, Avatar, Spin } from 'antd';
import {
  EyeOutlined,
  TeamOutlined,
  GlobalOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useGetStaffQuery } from '@/rtk/api/userApi';

const { Option } = Select;

const VISIBILITY_OPTIONS = [
  {
    value: 'internal',
    label: 'Internal Only',
    desc: 'Visible only to internal team',
    icon: <EyeOutlined />,
    color: '#1677ff',
  },
  {
    value: 'team',
    label: 'Team Visible',
    desc: 'Visible only to matter team',
    icon: <TeamOutlined />,
    color: '#52c41a',
  },
  {
    value: 'client',
    label: 'Client Visible',
    desc: 'Visible to client & team',
    icon: <GlobalOutlined />,
    color: '#fa8c16',
  },
  {
    value: 'restricted',
    label: 'Restricted',
    desc: 'Only selected users',
    icon: <LockOutlined />,
    color: '#ff4d4f',
  },
];

export default function VisibilitySelector() {
  const { data: staffData, isLoading } = useGetStaffQuery();

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Spin />
      </div>
    );
  }

  const staff = (staffData || []).map((u) => ({
    value: u._id,
    label: `${u.firstname} ${u.lastname} (${u.position})`,
    user: u,
  }));

  const renderOption = (item) => (
    <div className="flex gap-3 items-start leading-5">
      <span style={{ color: item.color, fontSize: 16, marginTop: 2 }}>
        {item.icon}
      </span>
      <div className="flex flex-col">
        <p className="font-semibold">{item.label}</p>
        <p className="text-xs text-gray-400">{item.desc}</p>
      </div>
    </div>
  );

  const renderStaffOption = (item) => (
    <Space>
      <Avatar
        size="small"
        src={item.user?.profileUrl}
        icon={<UserOutlined />}
      />
      {item.label}
    </Space>
  );

  return (
    <>
      {/* Visibility */}
      <Form.Item
        name="visibility"
        label="Visibility"
        rules={[{ required: true, message: 'Choose visibility' }]}
      >
        <Select size="large" placeholder="Select visibility">
          {VISIBILITY_OPTIONS.map((v) => (
            <Option key={v.value} value={v.value}>
              {renderOption(v)}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Permitted Users */}
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const visibility = getFieldValue('visibility');
          if (visibility !== 'restricted') return null;

          return (
            <Form.Item
              name="permittedUsers"
              label="Permitted Users"
              rules={[{ required: true, message: 'Select at least one user' }]}
            >
              <Select
                mode="multiple"
                allowClear
                size="large"
                showSearch
                placeholder="Select users"
                optionFilterProp="label"
              >
                {staff.map((item) => (
                  <Option
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  >
                    {renderStaffOption(item)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }}
      </Form.Item>
    </>
  );
}
