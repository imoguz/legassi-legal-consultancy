"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import MainHeader from "@/components/homepage/MainHeader";
import MainHome from "@/components/homepage/MainHome";
import MainFooter from "@/components/homepage/MainFooter";

const { Content } = Layout;

export default function Homepage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <Layout>
      <MainHeader />
      <Content>
        <MainHome />
      </Content>
      <MainFooter />
    </Layout>
  );
}
