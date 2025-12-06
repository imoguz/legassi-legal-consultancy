// dashboard/matters/create/page.js
'use client';
import React from 'react';
import { useCreateMatterMutation } from '@/rtk/api/matterApi';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  Row,
  Col,
  Tag,
  DatePicker,
  InputNumber,
  Divider,
  Alert,
} from 'antd';
import {
  SaveOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import DetailHeader from '@/components/common/DetailHeader';
import { useGetContactsQuery } from '@/rtk/api/contactApi';
import {
  practiceAreaOptions,
  statusOptions,
  priorityOptions,
  stageOptions,
  billingModelOptions,
  confidentialityOptions,
} from '@/utils/options';
import { notify } from '@/utils/helpers';
import { useGetUsersQuery } from '@/rtk/api/userApi';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const MatterCreatePage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [createMatter, { isLoading }] = useCreateMatterMutation();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const { data: contactsData, isLoading: contactsLoading } =
    useGetContactsQuery();

  // Attorney options (filter users with attorney/partner roles)
  const attorneyOptions =
    usersData?.data
      ?.filter((user) => ['attorney', 'partner', 'admin'].includes(user.role))
      ?.map((user) => ({
        value: user._id,
        label: `${user.firstname} ${user.lastname}`,
        role: user.role,
      })) || [];

  // Client options
  const clientOptions =
    contactsData?.data?.map((client) => ({
      value: client._id,
      label: String(client.fullName),
      type: client.type,
    })) || [];

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        client: values.client,
        primaryAttorney: values.primaryAttorney || user.id,
        practiceArea: values.practiceArea,
        description: values.description,
        status: values.status || 'open',
        stage: values.stage || 'intake',
        priority: values.priority || 'medium',
        confidentiality: values.confidentiality || 'private',
        dates: {
          openingDate: values.openingDate
            ? values.openingDate.toISOString()
            : new Date().toISOString(),
          deadline: values.deadline ? values.deadline.toISOString() : undefined,
        },
        billing: {
          billingModel: values.billingModel || 'hourly',
          hourlyRate: values.hourlyRate || undefined,
          currency: values.currency || 'USD',
        },
        // Team assignment - primary attorney automatically added to team
        team: values.primaryAttorney
          ? [
              {
                user: values.primaryAttorney,
                role: 'attorney',
                isPrimary: true,
                assignedBy: user.id,
              },
            ]
          : [],
      };

      const result = await createMatter(payload).unwrap();
      notify.success('Success', 'New matter has been created successfully.');
      router.push(`/dashboard/matters/${result._id}`);
    } catch (err) {
      notify.error(
        'Failed to Create Matter',
        err?.data?.message || 'Please check your entries and try again.'
      );
    }
  };

  const handleBillingModelChange = (value) => {
    if (value !== 'hourly') {
      form.setFieldValue('hourlyRate', undefined);
    }
  };

  return (
    <div className="p-6 max-w-[1512px] mx-auto">
      <DetailHeader title="Create New Matter" backUrl="/dashboard/matters" />

      <Alert
        message="Create a new matter. Basic information can be filled now, additional details can be added later in the matter edit page."
        type="info"
        showIcon
        className="mb-6"
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          {/* Left Column - Basic Information */}
          <Col xs={24} lg={14}>
            <Card
              title="Basic Information"
              className="mb-6"
              extra={<UserOutlined className="text-blue-500" />}
            >
              <Form.Item
                label="Matter Title"
                name="title"
                rules={[
                  { required: true, message: 'Please enter matter title' },
                  { min: 3, message: 'Title must be at least 3 characters' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="e.g., Smith vs. Johnson Contract Dispute"
                />
              </Form.Item>

              <Form.Item
                name="client"
                label="Client"
                rules={[{ required: true, message: 'Please select a client' }]}
              >
                <Select
                  loading={contactsLoading}
                  placeholder="Select client"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {clientOptions.map((option) => (
                    <Option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        <Tag
                          color={
                            option.type === 'individual' ? 'blue' : 'purple'
                          }
                        >
                          {option.type}
                        </Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="practiceArea"
                label="Practice Area"
                rules={[
                  { required: true, message: 'Please select practice area' },
                ]}
              >
                <Select
                  placeholder="Select practice area"
                  size="large"
                  options={practiceAreaOptions}
                />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <TextArea
                  rows={4}
                  placeholder="Provide a detailed description of the matter, including key facts, objectives, and any special considerations..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Card>

            {/* Billing Information */}
            <Card
              title="Billing & Financial"
              className="mb-6"
              extra={<DollarOutlined className="text-green-500" />}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="billingModel"
                    label="Billing Model"
                    initialValue="hourly"
                  >
                    <Select
                      options={billingModelOptions}
                      onChange={handleBillingModelChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="currency"
                    label="Currency"
                    initialValue="USD"
                  >
                    <Select>
                      <Option value="USD">USD ($)</Option>
                      <Option value="EUR">EUR (€)</Option>
                      <Option value="GBP">GBP (£)</Option>
                      <Option value="TRY">TRY (₺)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.billingModel !== currentValues.billingModel
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('billingModel') === 'hourly' && (
                    <Form.Item
                      name="hourlyRate"
                      label="Hourly Rate"
                      rules={[
                        { required: true, message: 'Please enter hourly rate' },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        min={0}
                        step={50}
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column - Matter Details */}
          <Col xs={24} lg={10}>
            <Card
              title="Matter Details"
              className="mb-6"
              extra={<CalendarOutlined className="text-orange-500" />}
            >
              <Form.Item name="status" label="Status" initialValue="open">
                <Select options={statusOptions} />
              </Form.Item>

              <Form.Item name="stage" label="Stage" initialValue="intake">
                <Select options={stageOptions} />
              </Form.Item>

              <Form.Item name="priority" label="Priority" initialValue="medium">
                <Select options={priorityOptions} />
              </Form.Item>

              <Form.Item
                name="primaryAttorney"
                label="Primary Attorney"
                rules={[
                  { required: true, message: 'Please select primary attorney' },
                ]}
              >
                <Select
                  loading={usersLoading}
                  placeholder="Select primary attorney"
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {attorneyOptions.map((option) => (
                    <Option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        <Tag
                          color={option.role === 'partner' ? 'gold' : 'blue'}
                        >
                          {option.role}
                        </Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>

            {/* Dates */}
            <Card
              title="Important Dates"
              className="mb-6"
              extra={<CalendarOutlined className="text-green-500" />}
            >
              <Form.Item
                name="openingDate"
                label="Opening Date"
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item name="deadline" label="Deadline">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Card>

            {/* Confidentiality */}
            <Card
              title="Confidentiality"
              className="mb-6"
              extra={<SafetyCertificateOutlined className="text-red-500" />}
            >
              <Form.Item
                name="confidentiality"
                label="Confidentiality Level"
                initialValue="private"
              >
                <Select options={confidentialityOptions} />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div className="flex justify-end gap-3">
          <Button
            id="cancel-matter-button"
            size="large"
            onClick={() => router.push('/dashboard/matters')}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            icon={<SaveOutlined />}
            id="create-matter-button"
            size="large"
          >
            Create Matter
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MatterCreatePage;
