// pages/pricing.jsx veya app/pricing/page.jsx

"use client";

import React, { useState } from "react";
import { Layout, Row, Col, Card, Button, Segmented, Badge } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Content } = Layout;

const rawPlans = [
  {
    key: "basic",
    title: "Starter",
    monthly: 0,
    annual: 0,
    features: [
      "100 AI-Search queries / mo",
      "AI-Chat (limited tokens)",
      "Up to 5 document uploads",
      "Email support",
    ],
    buttonText: "Get Started",
    buttonType: "default",
  },
  {
    key: "pro",
    title: "Professional",
    monthly: 49,
    annual: 490, // 2 months free
    features: [
      "Unlimited AI-Search",
      "Unlimited AI-Chat",
      "Unlimited document uploads",
      "Advanced filters & OCR",
      "Priority support",
    ],
    buttonText: "Choose Professional",
    buttonType: "primary",
    popular: true,
  },
  {
    key: "enterprise",
    title: "Enterprise",
    monthly: 149,
    annual: 1490,
    features: [
      "All Professional features",
      "On‑premise & SSO",
      "Dedicated account manager",
      "Customized SLAs",
      "24/7 phone support",
    ],
    buttonText: "Contact Sales",
    buttonType: "dashed",
  },
];

export default function PricingPage() {
  // Tip generiği yok, sadece başlangıç değeri
  const [billing, setBilling] = useState("monthly");

  return (
    <Layout
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-gradiend.jpg')" }}
    >
      <Content className="py-28">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold text-center mb-4">
            Pricing Plans
          </h1>
          <p className="text-center text-gray-600 mb-8">
            AI‑powered document search & chat, built for legal professionals.
          </p>

          <div className="flex justify-center mb-12">
            <Segmented
              options={[
                { label: "Monthly", value: "monthly" },
                { label: "Annual (2 mo free)", value: "annual" },
              ]}
              value={billing}
              onChange={(val) => setBilling(val)}
            />
          </div>

          <Row gutter={[24, 24]}>
            {rawPlans.map((plan) => {
              const price =
                plan[billing] === 0
                  ? "Free"
                  : `$${plan[billing]}/${billing === "monthly" ? "mo" : "yr"}`;

              const card = (
                <Card
                  variant="borderless"
                  className={`relative rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
                    plan.popular ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                  <p className="text-4xl font-bold mb-6">{price}</p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center text-gray-700">
                        <CheckCircleOutlined className="text-green-500 mr-2 text-lg" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button type={plan.buttonType} size="large" block>
                    {plan.buttonText}
                  </Button>
                </Card>
              );

              return (
                <Col xs={24} sm={12} md={8} key={plan.key}>
                  {plan.popular ? (
                    <Badge.Ribbon
                      text="Most Popular"
                      color="blue"
                      className="absolute -top-3 right-0 z-10"
                    >
                      {card}
                    </Badge.Ribbon>
                  ) : (
                    card
                  )}
                </Col>
              );
            })}
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
