"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import { Layout, Spin } from "antd";

const { Content } = Layout;

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Only redirect when user is not authenticated
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render layout only when authenticated
  return (
    <Layout className="min-h-screen">
      <Sidebar userRole={user?.role} />
      <Layout>
        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>
    </Layout>
  );
}
