"use client";

import Image from "next/image";
import { Layout, Menu, Divider, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getSidebarItems } from "@/utils/constants/sidebarMenuItems";
import { toggleSidebar, setSidebar } from "@/rtk/features/sidebarSlice";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const { user, isAuthenticated, isLoading } = useAuth();

  // Auth control
  useEffect(() => {
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

  if (!isAuthenticated) {
    return null;
  }

  const selectedKey = pathname.split("/").slice(2).join("/") || "dashboard";
  const sidebarItems = getSidebarItems(user?.role);

  const handleMenuClick = ({ key }) => {
    if (key !== selectedKey) router.push(`/dashboard/${key}`);
  };

  return (
    <Layout hasSider>
      <Sider
        breakpoint="md"
        collapsedWidth={50}
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => dispatch(setSidebar(val))}
        trigger={null}
        width={300}
        className="custom-scrollbar bg-sider-background! shadow sticky top-0 h-screen overflow-y-auto"
      >
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="relative h-16 flex justify-center items-center cursor-pointer bg-sider-header"
        >
          <Image
            src="/legassi.svg"
            alt="Legassi - Logo"
            width={collapsed ? 40 : 132}
            height={28}
            priority
          />
        </div>

        {/* Collapse / Expand */}
        <div className="flex justify-end px-4 pt-1">
          <span
            onClick={() => dispatch(toggleSidebar())}
            className="w-fit px-1 cursor-pointer rounded-sm text-sider-item-text hover:bg-sider-item-hover"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={sidebarItems}
          onClick={handleMenuClick}
          className="custom-menu bg-sider-background!"
        />
      </Sider>

      <Layout className="min-h-screen">
        <Header className="shadow-sm bg-sider-header! p-0 h-16 flex items-center">
          <DashboardHeader />
        </Header>

        <Content
          className="overflow-auto bg-sider-content relative"
          style={{ height: "calc(100vh - 104px)" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
