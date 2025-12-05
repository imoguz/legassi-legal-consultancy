"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Layout, Result, Typography } from "antd";
import Head from "next/head";
import { useRouter } from "next/navigation";

const VerifiedSuccess = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Email Verified Successfully</title>
        <meta
          name="description"
          content="Your email has been verified successfully"
        />
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full">
          <Result
            status="success"
            icon={<CheckCircleFilled className="text-green-500" />}
            title="Email Verification Successful!"
            subTitle="Your email address has been successfully verified. You can now access all features of our platform."
            extra={[
              <Button
                type="primary"
                key="home"
                onClick={() => router.push("/auth/login")}
                className="w-full"
              >
                Go to Login Page
              </Button>,
            ]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VerifiedSuccess;
