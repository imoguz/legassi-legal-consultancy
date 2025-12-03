"use client";

import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useCreateUserMutation } from "@/rtk/api/userApi";
import Link from "next/link";
import { notify } from "@/utils/helpers";

const { Title } = Typography;

const SignupPage = () => {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const onFinish = async (values) => {
    const { firstname, lastname, email, password } = values;
    try {
      await createUser({ firstname, lastname, email, password }).unwrap();

      notify.success("Login Successful", "Account created successfully!");

      router.push("/auth/login");
    } catch (error) {
      notify.error(
        "Login Failed",
        err?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title level={3} className="text-center">
          Sign Up
        </Title>

        <Form name="signup-form" onFinish={onFinish} layout="vertical">
          <div className="flex gap-4">
            <Form.Item
              label="First name"
              name="firstname"
              rules={[{ required: true }]}
              className="w-full"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="lastname"
              rules={[{ required: true }]}
              className="w-full"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="email@example.com" className="py-2" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{8,32}$/,
                message:
                  "Password must be 8-32 characters, include uppercase, lowercase, number, and special character.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
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

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              className="bg-blue-500 hover:bg-blue-600"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/auth/login">
            <span className="text-blue-500 hover:text-blue-600 ml-1 underline">
              Log in
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
