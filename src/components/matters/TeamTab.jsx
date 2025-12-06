'use client';

import { useEffect } from 'react';
import {
  List,
  Avatar,
  Tag,
  Button,
  Form,
  Select,
  Switch,
  Space,
  Card,
} from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useGetUsersQuery } from '@/rtk/api/userApi';
import { teamRoleOptions } from '@/utils/options';

export default function TeamTab({
  matter,
  formData,
  onFormChange,
  onSave,
  onCancel,
  isSaving,
}) {
  const [form] = Form.useForm();
  const { data: usersData } = useGetUsersQuery();

  const users = usersData?.data || [];

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.setFieldsValue({
        team: matter.team || [],
      });
    }
  }, [matter, formData, form]);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onFormChange(values);
  };

  const userOptions = users.map((user) => ({
    value: user._id,
    label: `${user.firstname} ${user.lastname}`,
    role: user.role,
  }));

  if (formData) {
    return (
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Form.List name="team">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} className="mb-4" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'user']}
                      label="Team Member"
                      rules={[
                        {
                          required: true,
                          message: 'Please select a team member',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select team member"
                        options={userOptions}
                        optionRender={({ data }) => (
                          <div className="flex justify-between items-center">
                            <span>{data.label}</span>
                            <Tag size="small">{data.role}</Tag>
                          </div>
                        )}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'role']}
                      label="Role"
                      rules={[
                        { required: true, message: 'Please select a role' },
                      ]}
                    >
                      <Select options={teamRoleOptions} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'isPrimary']}
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="Primary Attorney"
                        unCheckedChildren="Team Member"
                      />
                    </Form.Item>

                    <div className="text-right">
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Space>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Team Member
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    );
  }

  return (
    <Card>
      <List
        dataSource={matter.team || []}
        renderItem={(member, index) => (
          <List.Item
            actions={[
              <Tag
                key={`role-${member.user?._id || index}`}
                color={member.role === 'attorney' ? 'blue' : 'green'}
              >
                {member.role}
              </Tag>,

              member.isPrimary && (
                <Tag key={`primary-${member.user?._id || index}`} color="gold">
                  Primary
                </Tag>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={`${member.user?.firstname} ${member.user?.lastname}`}
              description={member.user?.email}
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No team members assigned' }}
      />
    </Card>
  );
}
