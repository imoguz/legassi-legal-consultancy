"use client";

import React, { useState } from "react";
import { Button, Tag, Avatar, Divider } from "antd";
import {
  EditOutlined,
  UserOutlined,
  PushpinOutlined,
  PaperClipOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { VISIBILITY_OPTIONS } from "@/utils/options";
import DocumentViewer from "../common/DocumentViewer";

export default function NoteDetail({ note, onEdit, onClose }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const getVisibilityInfo = (visibility) => {
    const option = VISIBILITY_OPTIONS.find((opt) => opt.value === visibility);
    return option || VISIBILITY_OPTIONS[0];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType && mimeType.startsWith("image/")) {
      return <FileImageOutlined className="text-blue-500 text-xl" />;
    }
    return <FilePdfOutlined className="text-red-500 text-xl" />;
  };

  const handleAttachmentClick = (attachment) => {
    setSelectedImage(attachment);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedImage(null);
  };

  const renderHeaderInfo = () => {
    const author = note?.author;
    const createdAt = note?.createdAt;
    const updatedAt = note?.updatedAt;
    const isEdited = updatedAt !== createdAt;

    return (
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              size="large"
              src={author?.profileUrl}
              icon={<UserOutlined />}
            />
            <div>
              <div className="font-semibold text-gray-900">
                {author
                  ? `${author.firstname} ${author.lastname}`
                  : "Unknown User"}
              </div>
              <div className="text-sm text-gray-600">
                {author?.position || "Lawyer"} • {author?.role || "User"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Created: {dayjs(createdAt).format("MMM D, YYYY h:mm A")}
            </div>
            {isEdited && (
              <div className="text-sm text-gray-500">
                Updated: {dayjs(updatedAt).format("MMM D, YYYY h:mm A")}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const visibilityInfo = getVisibilityInfo(note?.visibility);

  if (isPreviewOpen) {
    return (
      <DocumentViewer document={selectedImage} onClose={handleClosePreview} />
    );
  }

  return (
    <div className="space-y-4">
      {renderHeaderInfo()}

      <div className="flex items-center gap-4">
        <Tag
          color={
            note.visibility === "internal"
              ? "blue"
              : note.visibility === "client"
              ? "green"
              : note.visibility === "team"
              ? "orange"
              : "red"
          }
          icon={visibilityInfo.icon}
          className="flex items-center gap-1"
        >
          {visibilityInfo.label}
          {note.visibility === "restricted" &&
            note.permittedUsers &&
            note.permittedUsers.length > 0 &&
            `(${note.permittedUsers.length} Users)`}
        </Tag>
        {note.pinned && (
          <Tag
            color="geekblue"
            icon={<PushpinOutlined />}
            className="flex items-center gap-1"
          >
            PINNED
          </Tag>
        )}
      </div>

      <Divider />

      <div className="border rounded-lg p-1 bg-white">
        <div
          className="ql-editor p-2 min-h-24 text-gray-800 border border-solid border-gray-200 rounded-md"
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />
      </div>

      {note.attachments && note.attachments.length > 0 && (
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <PaperClipOutlined />
            Attachments ({note.attachments.length})
          </div>
          <div className="flex gap-2 flex-wrap">
            {note.attachments.map((attachment, index) => (
              <div
                key={attachment._id || index}
                className={`flex items-center gap-2 max-w-80 text-sm text-gray-600 p-2 rounded-md cursor-pointer ${
                  attachment.mimeType?.startsWith("image/")
                    ? "bg-sky-50 hover:bg-sky-100 hover:shadow-md transition-all duration-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleAttachmentClick(attachment)}
              >
                {getFileIcon(attachment.mimeType)}
                <span className="flex-1 line-clamp-1">
                  {attachment.filename ||
                    attachment.originalName ||
                    `Attachment ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
