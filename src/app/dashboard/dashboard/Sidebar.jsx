"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Sider } = Layout;

const getMenuItems = (role) => {
  const baseItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/documents",
      icon: <FileTextOutlined />,
      label: "Documents",
    },
  ];

  if (role === "admin") {
    baseItems.push({
      key: "/dashboard/admin",
      icon: <SettingOutlined />,
      label: "Admin Panel",
    });
  }

  if (role === "lawyer" || role === "admin") {
    baseItems.push({
      key: "/dashboard/clients",
      icon: <UserOutlined />,
      label: "Clients",
    });
  }

  return baseItems;
};

export default function Sidebar({ userRole }) {
  const router = useRouter();

  const handleMenuClick = ({ key }) => {
    router.push(key);
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" className="min-h-screen">
      <div className="h-16 flex items-center justify-center text-white">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={getMenuItems(userRole)}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}
