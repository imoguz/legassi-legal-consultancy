"use client";

import React from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Avatar,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  BankOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  statusColorMap,
  priorityColorMap,
  stageColorMap,
  confidentialityColorMap,
} from "@/utils/constants";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

export default function OverviewTab({ matter }) {
  const {
    title,
    matterNumber,
    client,
    primaryAttorney,
    team = [],
    status,
    stage,
    priority,
    practiceArea,
    court,
    financials = {},
    dates = {},
    confidentiality,
    createdAt,
    updatedAt,
  } = matter;

  // Financial summary card
  const FinancialSummaryCard = () => (
    <Card
      className="h-full financial-summary-card"
      title={
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-600" />
          <span>Financial Summary</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border">
            <Text className="text-2xl font-bold text-blue-600 block">
              ${financials.totalBilled?.toLocaleString() || "0"}
            </Text>
            <Text className="text-gray-600 text-sm">Total Billed</Text>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <Text className="text-2xl font-bold text-green-600 block">
              ${financials.totalPaid?.toLocaleString() || "0"}
            </Text>
            <Text className="text-gray-600 text-sm">Total Paid</Text>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg border">
            <Text className="text-2xl font-bold text-orange-600 block">
              ${financials.outstanding?.toLocaleString() || "0"}
            </Text>
            <Text className="text-gray-600 text-sm">Outstanding</Text>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border">
            <Text className="text-2xl font-bold text-purple-600 block">
              ${financials.retainerBalance?.toLocaleString() || "0"}
            </Text>
            <Text className="text-gray-600 text-sm">Retainer Balance</Text>
          </div>
        </div>
      </div>
    </Card>
  );

  // Matter details card
  const MatterDetailsCard = () => (
    <Card
      className="h-full"
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-600" />
          <span>Matter Details</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Text strong className="text-gray-600 text-sm block mb-1">
            Title
          </Text>
          <Title level={5} className="!mt-0 !mb-2">
            {title}
          </Title>
          <Text type="secondary" className="font-mono text-sm">
            #{matterNumber}
          </Text>
        </div>

        <Divider className="my-4!" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text strong className="text-gray-600 text-sm block mb-1">
              Status
            </Text>
            <Tag color={statusColorMap[status]} className="m-0!">
              {status?.replace("-", " ").toUpperCase()}
            </Tag>
          </div>
          <div>
            <Text strong className="text-gray-600 text-sm block mb-1">
              Stage
            </Text>
            <Tag color={stageColorMap[stage]} className="m-0!">
              {stage?.toUpperCase()}
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text strong className="text-gray-600 text-sm block mb-1">
              Priority
            </Text>
            <Tag color={priorityColorMap[priority]} className="m-0!">
              {priority?.toUpperCase()}
            </Tag>
          </div>
          <div>
            <Text strong className="text-gray-600 text-sm block mb-1">
              Confidentiality
            </Text>
            <Tag
              color={confidentialityColorMap[confidentiality]}
              icon={<SafetyCertificateOutlined />}
              className="m-0!"
            >
              {confidentiality?.toUpperCase()}
            </Tag>
          </div>
        </div>

        <div>
          <Text strong className="text-gray-600 text-sm block mb-1">
            Practice Area
          </Text>
          <Text>{practiceArea || "Not specified"}</Text>
        </div>
      </div>
    </Card>
  );

  // Team & Contacts card
  const TeamContactsCard = () => (
    <Card
      className="h-full"
      title={
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-purple-600" />
          <span>Team & Contacts</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Text strong className="text-gray-600 text-sm block mb-2">
            Client
          </Text>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <Avatar size="small" icon={<UserOutlined />} />
            <div>
              <Text strong className="block">
                {client?.fullName}
              </Text>
              {client?.email && (
                <Text type="secondary" className="text-xs">
                  {client.email}
                </Text>
              )}
            </div>
          </div>
        </div>

        <div>
          <Text strong className="text-gray-600 text-sm block mb-2">
            Primary Attorney
          </Text>
          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
            <Avatar
              size="small"
              src={primaryAttorney?.profileUrl}
              icon={<UserOutlined />}
            />
            <div>
              <Text strong className="block">
                {primaryAttorney
                  ? `${primaryAttorney.firstname} ${primaryAttorney.lastname}`
                  : "Not assigned"}
              </Text>
              {primaryAttorney?.email && (
                <Text type="secondary" className="text-xs">
                  {primaryAttorney.email}
                </Text>
              )}
            </div>
          </div>
        </div>

        {team.length > 0 && (
          <div>
            <Text strong className="text-gray-600 text-sm block mb-2">
              Team Members ({team.length})
            </Text>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                >
                  <Avatar
                    size="small"
                    src={member.user?.profileUrl}
                    icon={<UserOutlined />}
                  />
                  <div className="flex-1 min-w-0">
                    <Text strong className="block text-sm truncate">
                      {member.user
                        ? `${member.user.firstname} ${member.user.lastname}`
                        : "Unknown User"}
                    </Text>
                    <div className="flex justify-between items-center">
                      <Text type="secondary" className="text-xs">
                        {member.role}
                      </Text>
                      {member.isPrimary && (
                        <Badge
                          count="Primary"
                          size="small"
                          className="!text-xs"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  // Court & Dates card
  const CourtDatesCard = () => (
    <Card
      className="h-full"
      title={
        <div className="flex items-center gap-2">
          <BankOutlined className="text-orange-600" />
          <span>Court & Important Dates</span>
        </div>
      }
    >
      <div className="space-y-4">
        {court && (court.name || court.caseNumber) && (
          <div>
            <Text strong className="text-gray-600 text-sm block mb-2">
              Court Information
            </Text>
            <div className="space-y-1 text-sm">
              {court.name && (
                <div>
                  <Text strong>Court:</Text> {court.name}
                </div>
              )}
              {court.caseNumber && (
                <div>
                  <Text strong>Case #:</Text> {court.caseNumber}
                </div>
              )}
              {court.location && (
                <div>
                  <Text strong>Location:</Text> {court.location}
                </div>
              )}
              {court.judge && (
                <div>
                  <Text strong>Judge:</Text> {court.judge}
                </div>
              )}
            </div>
          </div>
        )}

        <Divider className="!my-4" />

        <div>
          <Text strong className="text-gray-600 text-sm block mb-2">
            Important Dates
          </Text>
          <div className="space-y-2">
            {dates.nextHearing && (
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded border">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-yellow-600" />
                  <Text strong className="text-sm">
                    Next Hearing
                  </Text>
                </div>
                <Tooltip
                  title={dayjs(dates.nextHearing).format("MMMM D, YYYY")}
                >
                  <Text strong className="text-yellow-700">
                    {dayjs(dates.nextHearing).format("MMM D, YYYY")}
                  </Text>
                </Tooltip>
              </div>
            )}

            {dates.appealDeadline && (
              <div className="flex justify-between items-center p-2 bg-red-50 rounded border">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-red-600" />
                  <Text strong className="text-sm">
                    Appeal Deadline
                  </Text>
                </div>
                <Tooltip
                  title={dayjs(dates.appealDeadline).format("MMMM D, YYYY")}
                >
                  <Text strong className="text-red-700">
                    {dayjs(dates.appealDeadline).format("MMM D, YYYY")}
                  </Text>
                </Tooltip>
              </div>
            )}

            {dates.deadline && (
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded border">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-blue-600" />
                  <Text strong className="text-sm">
                    Deadline
                  </Text>
                </div>
                <Tooltip title={dayjs(dates.deadline).format("MMMM D, YYYY")}>
                  <Text strong className="text-blue-700">
                    {dayjs(dates.deadline).format("MMM D, YYYY")}
                  </Text>
                </Tooltip>
              </div>
            )}

            {!dates.nextHearing && !dates.appealDeadline && !dates.deadline && (
              <Text type="secondary" className="text-sm">
                No important dates scheduled
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  // System Info card
  const SystemInfoCard = () => (
    <Card className="h-full" title="System Information" size="small">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <Text type="secondary">Created</Text>
          <Tooltip title={dayjs(createdAt).format("MMMM D, YYYY h:mm A")}>
            <Text>{dayjs(createdAt).fromNow()}</Text>
          </Tooltip>
        </div>
        <div className="flex justify-between">
          <Text type="secondary">Last Updated</Text>
          <Tooltip title={dayjs(updatedAt).format("MMMM D, YYYY h:mm A")}>
            <Text>{dayjs(updatedAt).fromNow()}</Text>
          </Tooltip>
        </div>
        <div className="flex justify-between">
          <Text type="secondary">Matter ID</Text>
          <Text copyable className="font-mono text-xs">
            {matter._id}
          </Text>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="overview-tab space-y-6">
      {/* Top Row - Matter Details & Financial Summary */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <MatterDetailsCard />
        </Col>
        <Col xs={24} lg={12}>
          <FinancialSummaryCard />
        </Col>
      </Row>

      {/* Middle Row - Team & Court Information */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <TeamContactsCard />
        </Col>
        <Col xs={24} lg={12}>
          <CourtDatesCard />
        </Col>
      </Row>

      {/* Bottom Row - System Information */}
      <Row>
        <Col xs={24}>
          <SystemInfoCard />
        </Col>
      </Row>
    </div>
  );
}
