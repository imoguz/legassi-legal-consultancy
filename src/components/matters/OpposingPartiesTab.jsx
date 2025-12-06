'use client';

import { useEffect } from 'react';
import { List, Card, Button, Form, Input, Select, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function OpposingPartiesTab({
  matter,
  formData,
  onFormChange,
  onSave,
  onCancel,
  isSaving,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.setFieldsValue({
        opposingParties: matter.opposingParties || [],
      });
    }
  }, [matter, formData, form]);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onFormChange(values);
  };

  const partyTypeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'government', label: 'Government' },
    { value: 'other', label: 'Other' },
  ];

  if (formData) {
    return (
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Form.List name="opposingParties">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  className="mb-4"
                  size="small"
                  title={`Opposing Party ${name + 1}`}
                  extra={
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    >
                      Remove
                    </Button>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Name"
                      rules={[{ required: true, message: 'Name is required' }]}
                    >
                      <Input placeholder="Enter party name" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      label="Type"
                    >
                      <Select options={partyTypeOptions} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'representative']}
                      label="Representative"
                    >
                      <Input placeholder="Enter representative name" />
                    </Form.Item>

                    <Card size="small" title="Contact Information">
                      <Form.Item
                        {...restField}
                        name={[name, 'contactInfo', 'phone']}
                        label="Phone"
                      >
                        <Input placeholder="Enter phone number" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'contactInfo', 'email']}
                        label="Email"
                        rules={[
                          {
                            type: 'email',
                            message: 'Please enter valid email',
                          },
                        ]}
                      >
                        <Input placeholder="Enter email address" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'contactInfo', 'address']}
                        label="Address"
                      >
                        <Input.TextArea rows={2} placeholder="Enter address" />
                      </Form.Item>
                    </Card>

                    <Form.Item
                      {...restField}
                      name={[name, 'notes']}
                      label="Notes"
                    >
                      <Input.TextArea rows={2} placeholder="Additional notes" />
                    </Form.Item>
                  </Space>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Opposing Party
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
        dataSource={matter.opposingParties || []}
        renderItem={(party, index) => (
          <List.Item
            actions={[
              <Tag
                key={`party-type-${index}`}
                color={
                  party.type === 'individual'
                    ? 'blue'
                    : party.type === 'company'
                    ? 'green'
                    : party.type === 'government'
                    ? 'red'
                    : 'orange'
                }
              >
                {party.type}
              </Tag>,
            ]}
          >
            <List.Item.Meta
              avatar={<UserOutlined />}
              title={party.name}
              description={
                <Space direction="vertical" size="small">
                  {party.representative && (
                    <div>Representative: {party.representative}</div>
                  )}
                  {party.contactInfo?.phone && (
                    <div>Phone: {party.contactInfo.phone}</div>
                  )}
                  {party.contactInfo?.email && (
                    <div>Email: {party.contactInfo.email}</div>
                  )}
                  {party.notes && <div>Notes: {party.notes}</div>}
                </Space>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No opposing parties added' }}
      />
    </Card>
  );
}
