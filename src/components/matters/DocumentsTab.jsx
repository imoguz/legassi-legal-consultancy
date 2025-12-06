"use client";

import { useState } from "react";
import { List, Card, Button, Upload, Image, Tag, Space, Tooltip } from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DocumentViewer from "../common/DocumentViewer";

export default function DocumentsTab({ matter }) {
  const [preview, setPreview] = useState({
    visible: false,
    type: null,
    document: null,
  });

  const handlePreview = (doc) => {
    if (!doc?.fileType) return;
    const mime = doc.fileType.toLowerCase();

    if (mime === "application/pdf") {
      setPreview({ visible: true, type: "pdf", document: doc });
    } else if (mime.startsWith("image/")) {
      setPreview({ visible: true, type: "image", document: doc });
    }
  };

  const handleClose = () => {
    setPreview({ visible: false, type: null, document: null });
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf")) return "📄";
    if (fileType?.includes("image")) return "🖼️";
    if (fileType?.includes("word")) return "📝";
    return "📎";
  };

  const getFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Documents</h3>
            <p className="text-gray-600">Upload and manage matter documents</p>
          </div>
          <Upload beforeUpload={() => false} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>
              Upload Document
            </Button>
          </Upload>
        </div>
      </Card>

      {/* Documents List */}
      <Card>
        <List
          dataSource={matter.documents || []}
          renderItem={(doc) => (
            <List.Item
              actions={[
                <Tooltip key={`preview-${doc._id}`} title="Preview">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(doc)}
                  />
                </Tooltip>,

                <Tooltip key={`download-${doc._id}`} title="Download">
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    href={doc.fileUrl}
                    download
                  />
                </Tooltip>,

                <Tooltip key={`delete-${doc._id}`} title="Delete">
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <span className="text-2xl">{getFileIcon(doc.fileType)}</span>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{doc.title}</span>
                    {doc.category && <Tag color="blue">{doc.category}</Tag>}
                  </div>
                }
                description={
                  <Space direction="vertical" size="small">
                    <div className="text-gray-600">{doc.description}</div>
                    <div className="text-xs text-gray-500">
                      {getFileSize(doc.fileSize)} • {doc.fileType}
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: "No documents uploaded yet" }}
        />
      </Card>

      {/* Preview Modals */}
      {preview.visible && preview.type === "image" && (
        <Image
          style={{ display: "none" }}
          src={preview.document.fileUrl}
          alt={preview.document.title}
          preview={{
            visible: true,
            onVisibleChange: (v) => !v && handleClose(),
          }}
        />
      )}

      {preview.visible && preview.type === "pdf" && (
        <DocumentViewer
          document={preview.document.fileUrl}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
