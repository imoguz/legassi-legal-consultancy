"use client";

import MainFooter from "@/components/layouts/MainFooter";
import MainHeader from "@/components/layouts/MainHeader";
import { Layout } from "antd";

const { Content } = Layout;

export default function PublicLayout({ children }) {
  return (
    <Layout className="min-h-screen flex flex-col">
      <MainHeader />
      <Content className="flex-1">{children}</Content>
      <MainFooter />
    </Layout>
  );
}
