'use client';

import { Form, Input, Button, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useForgotPasswordMutation } from '@/rtk/api/authApi';
import { notify } from '@/utils/helpers/notificationHelper';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async ({ email }) => {
    try {
      await forgotPassword({ email }).unwrap();
      notify.success(
        'Email Sent',
        'If an account exists for this email, you will receive a password reset link shortly.'
      );
    } catch (error) {
      notify.error('Error', error?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title level={3} className="text-center">
          Forgot Password
        </Title>
        <Paragraph className="text-center text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Paragraph>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
              block
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-between mx-1 mt-5 text-sm text-blue-500">
          <span className="text-gray-500">Remembered your password?</span>
          <Link href="/auth/login">
            <span className="text-blue-500 hover:text-blue-600 ml-1 underline">
              Back to login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
