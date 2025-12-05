"use client";

import React from "react";
import { Layout, Row, Col, Card, Steps, Avatar, Button } from "antd";
import {
  SearchOutlined,
  CommentOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Step } = Steps;

const features = [
  {
    icon: <SearchOutlined />,
    title: "AI-Document Search",
    desc: "Find clauses, precedents and more instantly in your own uploads.",
  },
  {
    icon: <CommentOutlined />,
    title: "AI-Chat Assistant",
    desc: "Ask complex legal questions in plain English and get concise answers.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Enterprise-Grade Security",
    desc: "GDPR & HIPAA compliant with bank-level encryption.",
  },
];

const journey = [
  { title: "2023 Q1", desc: "Idea: Bridging AI & Legal" },
  { title: "2023 Q3", desc: "Prototype: Document Search" },
  { title: "2024 Q2", desc: "Beta: AI-Chat Launch" },
  { title: "2025 Q1", desc: "Onboarded 1,000+ Firms" },
];

const team = [
  { name: "John Doe", role: "Co-Founder & CEO" },
  { name: "John Doe", role: "Co-Founder & CTO" },
  { name: "John Doe", role: "Lead AI Engineer" },
  { name: "John Doe", role: "Head of Product" },
];

export default function AboutPage() {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="py-0">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-24">
          <h1 className="text-5xl font-extrabold mb-4">About Legassi</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering legal professionals with AI-powered document search,
            analysis, and conversational support.
          </p>
        </div>

        {/* Features */}
        <div className="container mx-auto px-6 mt-16">
          <Row gutter={[32, 32]}>
            {features.map((f) => (
              <Col xs={24} md={8} key={f.title}>
                <Card
                  variant="borderless"
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all p-8 text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-4xl text-blue-600">{f.icon}</div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Our Journey */}
        <div className="container mx-auto px-6 mt-24">
          <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>
          <div className="overflow-x-auto">
            <Steps
              responsive={false}
              current={-1}
              className="max-w-4xl mx-auto"
              orientation="horizontal"
              titlePlacement="vertical"
            >
              {journey.map((step) => (
                <Step
                  key={step.title}
                  title={step.title}
                  description={step.desc}
                  icon={<RocketOutlined />}
                />
              ))}
            </Steps>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="container mx-auto px-6 mt-24">
          <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
          <Row gutter={[32, 32]}>
            {team.map((m, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card
                  variant="borderless"
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all p-8 text-center"
                >
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    className="mx-auto mb-4"
                  />
                  <h4 className="text-xl font-semibold">{m.name}</h4>
                  <p className="text-gray-500">{m.role}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Call to Action */}
        <div className="container mx-auto px-6 mt-24 mb-16 text-center">
          <Card className="bg-blue-600 text-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Ready to revolutionize your legal workflow?
            </h2>
            <p className="mb-6 text-lg">
              Start your free trial today and see AI in action on your
              documents.
            </p>
            <Button size="large" type="primary" className="px-12 py-4 text-lg">
              Start Free Trial
            </Button>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
