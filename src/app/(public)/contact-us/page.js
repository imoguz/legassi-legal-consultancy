"use client";

import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Card, Typography } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = (values) => {
    setIsSubmitting(true);
    console.log("Form submitted:", values);

    setTimeout(() => {
      setIsSubmitting(false);
      form.resetFields();
      alert("Thank you! We'll contact you soon.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container bg-sky-400 mx-auto pt-20">
        {/* Header */}
        <div className="text-center ">
          <Title level={1} className="">
            Contact Us
          </Title>
          <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get in touch with our legal team for expert advice and support.
          </Paragraph>
        </div>

        {/* Contact Info Cards - TOP */}
        <Row gutter={[16, 16]} className="mb-12">
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center h-full">
              <EnvironmentOutlined className="text-blue-600 text-3xl mb-4" />
              <Title level={4} className="!mb-2">
                Address
              </Title>
              <Paragraph className="text-gray-600">
                123 Legal Avenue
                <br />
                Istanbul, Turkey
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="text-center h-full">
              <PhoneOutlined className="text-green-600 text-3xl mb-4" />
              <Title level={4} className="!mb-2">
                Phone
              </Title>
              <Paragraph className="text-gray-600">
                +90 212 345 6789
                <br />
                Mon - Fri, 9am - 6pm
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="text-center h-full">
              <MailOutlined className="text-purple-600 text-3xl mb-4" />
              <Title level={4} className="!mb-2">
                Email
              </Title>
              <Paragraph className="text-gray-600">
                support@legassi.com
                <br />
                info@legassi.com
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="text-center h-full">
              <SendOutlined className="text-orange-600 text-3xl mb-4" />
              <Title level={4} className="!mb-2">
                Response
              </Title>
              <Paragraph className="text-gray-600">
                Within 24 hours
                <br />
                Fast & reliable
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Contact Form - BOTTOM */}
        <Card className="shadow-lg">
          <Title level={2} className="text-center !mb-8">
            Send a Message
          </Title>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Your name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="your@email.com"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="How can we help you?" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <TextArea
                rows={4}
                placeholder="Your message here..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SendOutlined />}
                size="large"
                className="px-16"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <Paragraph className="text-gray-500">
            We value your privacy and will never share your information with
            third parties.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
