'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Form, Input, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useResetPasswordMutation } from '@/rtk/api/authApi';
import { notify } from '@/utils/helpers/notificationHelper';

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [error, setError] = useState(null);

  const onFinish = async ({ password }) => {
    try {
      await resetPassword({ token, password }).unwrap();
      notify.success('Success', 'Your password has been reset.');
      router.push('/auth/login');
    } catch (err) {
      setError(err?.data?.error || 'An error occurred.');
      notify.error('Error', err?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title level={3} className="text-center">
          Reset Password
        </Title>
        <Paragraph className="text-center text-gray-600">
          Enter your new password below.
        </Paragraph>

        {error && <Paragraph type="danger">{error}</Paragraph>}

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{8,32}$/,
                message:
                  'Password must be 8-32 characters, include uppercase, lowercase, number, and special character.',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              className="py-2"
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
              block
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
