"use client";

import React from "react";
import {
  Card,
  Button,
  Tag,
  Avatar,
  Space,
  Popconfirm,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PushpinOutlined,
  PaperClipOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getVisibilityConfig = (visibility) => {
  const configs = {
    internal: { icon: <EyeInvisibleOutlined />, color: "blue" },
    client: { icon: <EyeOutlined />, color: "green" },
    team: { icon: <TeamOutlined />, color: "orange" },
    restricted: { icon: <LockOutlined />, color: "red" },
  };
  return configs[visibility] || configs.internal;
};

const NoteListItem = ({
  note,
  onView,
  onEdit,
  onDelete,
  isDeleting,
  deletingId,
}) => {
  const author = note?.author;
  const attachments = note?.attachments || [];
  const isThisNoteDeleting = deletingId === note._id;
  const visibilityConfig = getVisibilityConfig(note.visibility);

  return (
    <Col span={24}>
      <Card
        className={`relative group custom-shadow-1 cursor-pointer transition-all duration-200 mb-4 pr-5! rounded-md border-l-10! ${
          note.pinned ? "border-l-sky-300! " : "border-l-gray-200!"
        }`}
        onClick={() => onView(note)}
        styles={{
          body: {
            padding: "16px",
          },
        }}
        hoverable
      >
        <Row gutter={16} align="top">
          {/* Avatar Column */}
          <Col xs={2} sm={2} md={1}>
            <Avatar
              size="large"
              src={author?.profileUrl}
              icon={<UserOutlined />}
            />
          </Col>

          {/* Content Column */}
          <Col xs={22} sm={22} md={23} className="px-5!">
            {/* Header Section */}
            <Row justify="space-between" align="middle" className="mb-3">
              <Col>
                <Space wrap>
                  <span className="font-semibold text-gray-900">
                    {author
                      ? `${author.firstname} ${author.lastname}`
                      : "Unknown User"}
                  </span>
                  <Tag color="blue" className="text-xs">
                    {author?.position || "Lawyer"}
                  </Tag>
                </Space>
              </Col>
              <Col>
                <Space size="small">
                  {note.pinned && <PushpinOutlined className="text-red-500!" />}
                  <Tag
                    color={visibilityConfig.color}
                    icon={visibilityConfig.icon}
                  >
                    {note.visibility.toUpperCase()}
                  </Tag>
                  {note.visibility === "restricted" && note.permittedUsers && (
                    <Tag color="red" className="text-xs">
                      {note.permittedUsers.length} user(s)
                    </Tag>
                  )}
                </Space>
              </Col>
            </Row>

            {/* Content Section */}
            <div className="mb-3">
              <div
                className="text-gray-700 line-clamp-3 quill-preview min-h-17"
                dangerouslySetInnerHTML={{ __html: note.contentHtml }}
              />
            </div>

            {/* Footer Section */}
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={14} md={16}>
                <Space size="large" wrap>
                  <span className="font-medium text-xs text-gray-500">
                    {dayjs(note.createdAt).format("MMM D, YYYY [at] h:mm A")}
                  </span>
                  {attachments.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <PaperClipOutlined className="text-gray-400" />
                      {attachments.length} attachment
                      {attachments.length > 1 ? "s" : ""}
                    </span>
                  )}
                </Space>
              </Col>
              <Col xs={24} sm={10} md={8}>
                {note.updatedAt !== note.createdAt && (
                  <div className="text-right">
                    <span className="text-xs text-gray-400">
                      Edited {dayjs(note.updatedAt).fromNow()}
                    </span>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div
          className={`absolute top-0 right-0 w-0 h-full flex flex-col gap-2 justify-center rounded-r-md overflow-hidden group-hover:w-10 transition-all duration-500 ease-out
           ${note.pinned ? "bg-sky-300" : "bg-gray-200"}`}
        >
          <Tooltip placement="left" key="view" title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onView(note);
              }}
              className="text-blue-600 mx-1"
            />
          </Tooltip>
          <Tooltip placement="left" key="edit" title="Edit Note">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="text-green-600 mx-1"
            />
          </Tooltip>
          <Tooltip placement="left" key="delete" title="Delete Note">
            <Popconfirm
              placement="left"
              title="Delete Note"
              description="Are you sure you want to delete this note?"
              onConfirm={(e) => {
                e?.stopPropagation();
                onDelete(note._id);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                loading={isThisNoteDeleting}
                onClick={(e) => e.stopPropagation()}
                className="text-red-500 mx-1"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      </Card>
    </Col>
  );
};

export default NoteListItem;
