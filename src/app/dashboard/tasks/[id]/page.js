"use client";

import { useState } from "react";
import {
  Card,
  Tag,
  Avatar,
  List,
  Button,
  Typography,
  Timeline,
  Row,
  Col,
} from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  EyeOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { SquareCheck, Square } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetTaskByIdQuery } from "@/rtk/api/taskApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DetailHeader from "@/components/common/DetailHeader";
import TaskModal from "@/components/tasks/TaskModal";
import DocPreview from "@/components/common/DocPreview";

dayjs.extend(relativeTime);
const { Text, Paragraph, Title } = Typography;

const StatusTag = ({ status }) => {
  const map = {
    open: { color: "blue", label: "Open" },
    "in-progress": { color: "orange", label: "In Progress" },
    waiting: { color: "gold", label: "Waiting" },
    completed: { color: "green", label: "Completed" },
    cancelled: { color: "red", label: "Cancelled" },
  };
  const cfg = map[status] || map.open;
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
};

const PriorityBadge = ({ priority }) => {
  const map = {
    low: { color: "green", label: "Low" },
    medium: { color: "blue", label: "Medium" },
    high: { color: "orange", label: "High" },
    urgent: { color: "red", label: "Urgent" },
  };
  const cfg = map[priority] || map.medium;
  return (
    <Tag className="rounded-full px-3" color={cfg.color}>
      {cfg.label}
    </Tag>
  );
};

const VisibilityTag = ({ visibility }) => {
  const map = {
    internal: { color: "blue", label: "Internal Only", icon: <EyeOutlined /> },
    team: { color: "green", label: "Team Visible", icon: <TeamOutlined /> },
    client: { color: "orange", label: "Client Visible", icon: <EyeOutlined /> },
    restricted: { color: "red", label: "Restricted", icon: <EyeOutlined /> },
  };
  const cfg = map[visibility] || map.internal;
  return (
    <Tag color={cfg.color} icon={cfg.icon}>
      {cfg.label}
    </Tag>
  );
};

const InfoItem = ({ label, children }) => (
  <div className="flex gap-2 pb-1">
    <Text className="text-sm min-w-24">{label}</Text>
    <span>:</span>
    <span className="font-medium">{children}</span>
  </div>
);

const AssigneeItem = ({ a }) => (
  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
    <Avatar src={a.user?.profileUrl} icon={<UserOutlined />} />
    <div className="flex-1">
      <div className="font-medium">
        {a.user?.firstname} {a.user?.lastname}
      </div>
      <div className="text-sm text-gray-500 flex items-center gap-2">
        {a.user?.position}
        {a.isPrimary && <Tag color="blue">Primary</Tag>}
      </div>
    </div>
  </div>
);

const ChecklistItem = ({ item }) => (
  <div className="flex items-center gap-2 pb-2 rounded hover:bg-gray-50">
    {item.completed ? (
      <SquareCheck className="text-green-500" size={20} />
    ) : (
      <Square className="text-gray-500" size={20} />
    )}
    <div className="flex justify-between w-full">
      <p className={item.completed ? "line-through text-gray-600" : ""}>
        {item.title}
      </p>
      {item.completed && (
        <Tag color="green" className="rounded-full px-2 py-0.5 text-xs">
          Done
        </Tag>
      )}
    </div>
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div className="text-center py-8 text-gray-500">
    <div className="text-2xl mb-2">{icon}</div>
    <div>{text}</div>
  </div>
);

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [editVisible, setEditVisible] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: task, isLoading, error } = useGetTaskByIdQuery(params.id);
  if (isLoading)
    return (
      <div className="p-6">
        <Card loading />
      </div>
    );

  if (error || !task)
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <Title level={3}>Task Not Found</Title>
            <Text type="secondary">
              You don&apos;t have access or it does not exist.
            </Text>
            <div className="mt-4">
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </div>
        </Card>
      </div>
    );

  /* Timeline Items */
  const timeline = [
    {
      color: "green",
      content: (
        <div>
          <div className="font-medium">Task Created</div>
          <div className="text-gray-500 text-sm">
            {dayjs(task.createdAt).format("MMM D, YYYY h:mm A")}
          </div>
          <div className="text-xs text-gray-400">
            by {task.createdBy?.firstname} {task.createdBy?.lastname}
          </div>
        </div>
      ),
    },
    {
      color: "blue",
      content: (
        <div>
          <div className="font-medium">Last Updated</div>
          <div className="text-gray-500 text-sm">
            {dayjs(task.updatedAt).format("MMM D, YYYY h:mm A")}
          </div>
        </div>
      ),
    },
  ];

  if (task.dueDate) {
    const overdue = dayjs(task.dueDate).isBefore(dayjs());
    timeline.push({
      color: overdue ? "red" : "blue",
      icon: <ClockCircleOutlined />,
      content: (
        <div>
          <div className="font-medium">Due Date</div>
          <div className="text-gray-500 text-sm">
            {dayjs(task.dueDate).format("MMM D, YYYY h:mm A")}
          </div>
          <div
            className={`text-sm mt-1 ${
              overdue ? "text-red-500" : "text-gray-500"
            }`}
          >
            {overdue
              ? `Overdue by ${dayjs().diff(dayjs(task.dueDate), "day")} days`
              : `Due ${dayjs(task.dueDate).fromNow()}`}
          </div>
        </div>
      ),
    });
  }

  if (task.completedAt) {
    timeline.push({
      color: "green",
      icon: <CheckCircleOutlined />,
      content: (
        <div>
          <div className="font-medium">Task Completed</div>
          <div className="text-gray-500 text-sm">
            {dayjs(task.completedAt).format("MMM D, YYYY h:mm A")}
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="p-6 max-w-[1512px] mx-auto">
      <DetailHeader
        title={task.title}
        backUrl="/dashboard/tasks"
        onEdit={() => setEditVisible(true)}
        onDelete={() => {}}
      />

      <Row gutter={[16, 32]}>
        <Col xs={24} md={12} lg={8}>
          <Card
            title="Task Details"
            className="border-0 custom-shadow-1 h-full"
          >
            <div className="space-y-1.5">
              <InfoItem label="Matter">
                {task.matter?.matterNumber} - {task.matter?.title}
              </InfoItem>
              <InfoItem label="Status">
                <StatusTag status={task.status} />
              </InfoItem>
              <InfoItem label="Priority">
                <PriorityBadge priority={task.priority} />
              </InfoItem>
              <InfoItem label="Visibility">
                <VisibilityTag visibility={task.visibility} />
              </InfoItem>
              {task.estimatedMinutes && (
                <InfoItem label="Estimated Time">
                  {task.estimatedMinutes} minutes
                </InfoItem>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Description" className="border-0 custom-shadow-1 h-full">
            {task.description ? (
              <Paragraph className="whitespace-pre-wrap">
                {task.description}
              </Paragraph>
            ) : (
              <Text type="secondary">No description provided.</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Timeline" className="border-0 custom-shadow-1 h-full">
            <Timeline items={timeline} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Checklist" className="border-0 custom-shadow-1 h-full">
            {task.checklist?.length ? (
              <div className="space-y-2">
                {task.checklist.map((item, i) => (
                  <ChecklistItem key={i} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircleOutlined />}
                text="No checklist items"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Assignees" className="border-0 custom-shadow-1 h-full">
            {task.assignees?.length ? (
              <div className="space-y-3">
                {task.assignees.map((a, i) => (
                  <AssigneeItem key={i} a={a} />
                ))}
              </div>
            ) : (
              <EmptyState icon={<UserOutlined />} text="No assignees" />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Attachments" className="border-0 custom-shadow-1 h-full">
            {task.attachments?.length ? (
              <div className="flex flex-col gap-2">
                {task.attachments.map((attachment, index) => (
                  <div
                    key={attachment._id || index}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                      attachment.mimeType?.startsWith("image/")
                        ? "bg-sky-50 hover:bg-sky-100 hover:shadow-md transition-all duration-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedFile(attachment);
                      setIsPreviewOpen(true);
                    }}
                  >
                    {attachment.mimeType?.startsWith("image/") ? (
                      <FileImageOutlined className="text-blue-500 text-xl" />
                    ) : (
                      <FilePdfOutlined className="text-red-500 text-xl" />
                    )}
                    <span className="flex-1 line-clamp-1">
                      {attachment.filename ||
                        attachment.originalName ||
                        `Attachment ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<FileTextOutlined />} text="No attachments" />
            )}

            {isPreviewOpen && selectedFile && (
              <DocPreview
                image={selectedFile}
                onClose={() => {
                  setIsPreviewOpen(false);
                  setSelectedFile(null);
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <TaskModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        task={task}
        mode="edit"
      />
    </div>
  );
}
