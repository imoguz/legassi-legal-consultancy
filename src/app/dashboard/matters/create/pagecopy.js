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
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import DetailHeader from '@/components/common/DetailHeader';
import { useGetContactsQuery } from '@/rtk/api/contactApi';
import { matterTypeOptions, statusOptions } from '@/utils/options';
import { notify } from '@/utils/helpers';
import { useGetStaffQuery, useGetUsersQuery } from '@/rtk/api/userApi';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const MatterCreatePage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { role } = useSelector((state) => state.auth);

  const [createMatter, { isLoading }] = useCreateMatterMutation();
  const { data: staffData, isLoading: usersLoading } = useGetStaffQuery();
  const { data: contactsData, isLoading: contactsLoading } =
    useGetContactsQuery();

  const attorneyOptions =
    staffData?.map((user) => ({
      value: user._id,
      label: user.firstname + ' ' + user.lastname,
    })) || [];

  const clientOptions =
    contactsData?.data?.map((client) => ({
      value: client._id,
      label: String(client.fullName),
      customLabel: (
        <div className="flex items-center gap-x-2">
          <span>{client.fullName}</span>
          <Tag color={client.type === 'individual' ? 'green' : 'red'}>
            {client.type === 'individual' ? 'Individual' : 'Company'}
          </Tag>
        </div>
      ),
    })) || [];

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        client: values.client,
        description: values.description,
        matterType: values.matterType || 'other',
        status: values.status || 'open',
        feeType: values.feeType || undefined,
        assignedAttorney:
          role === 'admin' ? values.assignedAttorney : undefined,
        importantDates: {
          openingDate: values.openingDate
            ? values.openingDate.toISOString()
            : new Date().toISOString(),
        },
      };
      const result = await createMatter(payload).unwrap();
      notify.success(
        'Success',
        'The new legal matter has been created successfully.'
      );
      router.push(`/dashboard/matters/${result._id}`);
    } catch (err) {
      notify.error(
        'Failed to Create Matter',
        err?.data?.message || 'Please check your entries and try again.'
      );
    }
  };

  return (
    <div className="p-6 max-w-[1512px] mx-auto">
      <DetailHeader title="Create New Matter" backUrl="/dashboard/matters" />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={14}>
            <Card variant="outlined" className="mb-5">
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: 'Please enter matter title' },
                ]}
              >
                <Input size="large" placeholder="Enter matter title" />
              </Form.Item>

              <Form.Item
                name="client"
                label="Client"
                rules={[{ required: true, message: 'Please select a client' }]}
              >
                <Select
                  loading={contactsLoading}
                  placeholder="Select a client"
                  showSearch
                  optionLabelProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {clientOptions.map((option) => (
                    <Select.Option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    >
                      {option.customLabel}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="matterType"
                label="Matter Type"
                rules={[
                  { required: true, message: 'Please select a matter type' },
                ]}
              >
                <Select
                  placeholder="Select matter type"
                  options={matterTypeOptions}
                />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <TextArea
                  rows={3}
                  placeholder="Enter brief matter description"
                />
              </Form.Item>
            </Card>
          </Col>
          {/* Right Column */}
          <Col xs={24} lg={10}>
            <Card variant="outlined" className="mb-5">
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select
                  placeholder="Select matter status"
                  options={statusOptions}
                />
              </Form.Item>

              <Form.Item
                name="openingDate"
                label="Opening Date"
                rules={[
                  { required: true, message: 'Please select an opening date' },
                ]}
              >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
              {role === 'admin' && (
                <Form.Item
                  name="assignedAttorney"
                  label="Assigned Attorney"
                  rules={[
                    { required: true, message: 'Please select an attorney' },
                  ]}
                >
                  <Select
                    loading={usersLoading}
                    placeholder="Select Attorney"
                    showSearch
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={attorneyOptions}
                  />
                </Form.Item>
              )}
            </Card>
          </Col>
        </Row>
        <div className="flex justify-end">
          <Space>
            <Button
              id="cancel-matter-button"
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
            >
              Create Matter
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default MatterCreatePage;
