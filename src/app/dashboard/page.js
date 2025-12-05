"use client";

import React from "react";
import dayjs from "dayjs";
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Typography,
  Divider,
  Spin,
  Tag,
} from "antd";
import {
  FileSearchOutlined,
  TeamOutlined,
  AimOutlined,
  CalendarOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { useGetDocumentsQuery } from "@/rtk/api/documentApi";
import { useGetMattersQuery } from "@/rtk/api/matterApi";
import { useGetContactsQuery } from "@/rtk/api/contactApi";
import { useGetTasksQuery } from "@/rtk/api/taskApi";

const { Title, Paragraph } = Typography;

const DashboardPage = () => {
  const {
    data: docsData,
    isLoading: docsLoading,
    isError: docsError,
  } = useGetDocumentsQuery({ page: 1, limit: 3 });

  const {
    data: mattersData,
    isLoading: mattersLoading,
    isError: mattersError,
  } = useGetMattersQuery({ page: 1, limit: 1 });

  const {
    data: contactsData,
    isLoading: contactsLoading,
    isError: contactsError,
  } = useGetContactsQuery({ page: 1, limit: 5 });

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({
    page: 1,
    limit: 5,
    sortBy: "dueDate",
    sortOrder: "asc",
    filters: { status: "open" },
  });

  const {
    data: pendingTasksData,
    isLoading: pendingLoading,
    isError: pendingError,
  } = useGetTasksQuery({
    page: 1,
    limit: 1,
    filters: { status: "pending" },
  });

  const getPriorityTag = (priority) => {
    switch (priority) {
      case "high":
        return <Tag color="red">High</Tag>;
      case "medium":
        return <Tag color="orange">Medium</Tag>;
      case "low":
        return <Tag color="green">Low</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      <div>
        <Title level={2} className="mb-1!">
          Welcome to Legassi
        </Title>
        <Paragraph type="secondary" className="!text-gray-600">
          Manage all legal processes in one platform: matters, tasks, documents,
          clients, and AI-powered solutions.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-2xl hover:shadow-md transition">
            {mattersLoading ? (
              <Spin className="block mx-auto" />
            ) : mattersError ? (
              <div>Error loading matters</div>
            ) : (
              <Statistic
                title="Active Matters"
                value={mattersData?.pagination?.total || 0}
                prefix={<AimOutlined className="text-blue-500" />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-2xl hover:shadow-md transition">
            {contactsLoading ? (
              <Spin className="block mx-auto" />
            ) : contactsError ? (
              <div>Error loading contacts</div>
            ) : (
              <Statistic
                title="Clients"
                value={contactsData?.pagination?.total || 0}
                prefix={<TeamOutlined className="text-green-500" />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-2xl hover:shadow-md transition">
            <Statistic
              title="Upcoming Hearings"
              value={5}
              prefix={<CalendarOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-2xl hover:shadow-md transition">
            {pendingLoading ? (
              <Spin className="block mx-auto" />
            ) : pendingError ? (
              <div>Error loading tasks</div>
            ) : (
              <Statistic
                title="Pending Tasks"
                value={pendingTasksData?.pagination?.total || 0}
                prefix={<BarsOutlined className="text-orange-500" />}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Recent Documents & Tasks */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Recent Documents"
            className="shadow-sm rounded-2xl hover:shadow-md transition"
          >
            {docsLoading ? (
              <Spin className="block mx-auto" />
            ) : docsError ? (
              <div>Error loading documents</div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={docsData?.data || []}
                renderItem={(doc) => (
                  <List.Item className="hover:bg-gray-50 rounded-lg p-2 transition">
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileSearchOutlined />} />}
                      title={
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {doc.title}
                        </a>
                      }
                      description={`Uploaded by ${doc.uploadedBy} on ${dayjs(
                        doc.createdAt
                      ).format("MMM D, YYYY")}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Upcoming Tasks"
            className="shadow-sm rounded-2xl hover:shadow-md transition"
          >
            {tasksLoading ? (
              <Spin className="block mx-auto" />
            ) : tasksError ? (
              <div>Error loading tasks</div>
            ) : (
              <List
                dataSource={tasksData?.data || []}
                renderItem={(task) => (
                  <List.Item className="flex items-start space-x-3 hover:bg-gray-50 rounded-lg p-2 transition">
                    <BarsOutlined className="text-gray-400 mt-1" />
                    <div className="flex flex-col flex-1">
                      <a
                        href={`/tasks/${task._id}`}
                        className="font-medium text-gray-800 hover:text-blue-600"
                      >
                        {task.title}
                      </a>
                      <span className="text-xs text-gray-500">
                        {task.matter?.title ? `${task.matter.title} • ` : ""}
                        Due {dayjs(task.dueDate).format("MMM D, YYYY")}
                      </span>
                    </div>
                    {getPriorityTag(task.priority)}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* AI Modules */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="AI Document Search"
            className="shadow-sm rounded-2xl hover:shadow-md transition"
          >
            <Paragraph className="!mb-0 text-gray-600">
              Search your legal documents instantly using AI-powered search.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="AI Chat Assistant"
            className="shadow-sm rounded-2xl hover:shadow-md transition"
          >
            <Paragraph className="!mb-0 text-gray-600">
              Get instant answers to your legal questions from our AI assistant.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
