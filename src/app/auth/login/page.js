"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Typography, Spin, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLoginMutation } from "@/rtk/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { notify, setRefreshToken } from "@/utils/helpers";

const { Title } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, authLoading, redirect, router]);

  const handleSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();

      // Store refresh token from response in cookie
      if (result.refreshToken) {
        setRefreshToken(result.refreshToken);
      }

      notify.success("Login Successful", "Welcome back!");
    } catch (err) {
      notify.error(
        "Login Failed",
        err?.data?.error || "Login failed. Please try again."
      );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Don't show login page if already authenticated
  if (!authLoading && isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title level={3} className="text-center">
          Login
        </Title>

        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoggingIn}
              block
              className="bg-blue-500 hover:bg-blue-600"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-between mx-1 mt-5 text-sm  text-blue-500">
          <Link href="/auth/forgot-password">
            <span className="text-sm text-blue-500 hover:text-blue-600 underline">
              Forgot password?
            </span>
          </Link>
          <div className="text-gray-800 ">
            Don&apos;t have an account?
            <Link href="/auth/signup">
              <span className="text-blue-500 hover:text-blue-600 ml-1 underline">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
