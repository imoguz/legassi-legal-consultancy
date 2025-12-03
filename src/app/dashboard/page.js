"use client";

import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>Dashboard</Title>
          <Text type="secondary">
            Welcome back, {user?.firstname} {user?.lastname}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Title level={4}>Role</Title>
            <Text>{user?.role}</Text>
          </Card>
          <Card>
            <Title level={4}>Position</Title>
            <Text>{user?.position}</Text>
          </Card>
          <Card>
            <Title level={4}>Email</Title>
            <Text>{user?.email}</Text>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
