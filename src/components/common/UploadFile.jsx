"use client";

import React from "react";
import { Upload, Button, Space } from "antd";
import {
  PaperClipOutlined,
  EyeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const UploadFile = ({
  fileList = [],
  onChange,
  maxFiles = 5,
  disabled = false,
}) => {
  const existingFiles = fileList.filter((file) => !file.originFileObj);
  const newFiles = fileList.filter((file) => file.originFileObj);

  const handleUploadChange = ({ fileList: newFileList }) => {
    if (onChange) {
      onChange(newFileList);
    }
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    onChange(newFileList);
  };

  const handlePreview = (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
    } else if (file.originFileObj) {
      const url = URL.createObjectURL(file.originFileObj);
      window.open(url, "_blank");
    }
  };

  // Maksimum file count
  const isMaxFilesReached = fileList.length >= maxFiles;

  return (
    <div className="w-full">
      {fileList.length > 0 && (
        <Space orientation="vertical" className="w-full">
          {fileList.map((file, index) => (
            <div
              key={file.uid || file._id || index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center justify-between flex-1 border pl-3.5 min-h-10 rounded-lg border-gray-300">
                <div className="flex items-center gap-2 flex-1">
                  <PaperClipOutlined className="text-gray-400" />
                  <span className="text-sm text-gray-700 flex-1">
                    {file.name || file.filename || `Dosya ${index + 1}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {file.size
                      ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)`
                      : ""}
                  </span>
                </div>
                {(file.url || file.originFileObj) && (
                  <Button
                    type="text"
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(file)}
                    title="preview"
                    className="mx-1"
                  />
                )}
              </div>
              {!disabled && (
                <Button
                  type="default"
                  size="large"
                  icon={<MinusCircleOutlined />}
                  onClick={() => handleRemove(file)}
                  title="Remove"
                />
              )}
            </div>
          ))}
        </Space>
      )}
      <Upload
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={(file, fileList) => {
          if (fileList.length + existingFiles.length > maxFiles) {
            notify.warning(
              "Warning",
              `Maximum ${maxFiles} files can be uploaded.`
            );

            return false;
          }
          return false;
        }}
        onRemove={handleRemove}
        multiple
        showUploadList={false}
        disabled={disabled || isMaxFilesReached}
        className="flex justify-center"
      >
        <Button
          type="dashed"
          icon={<PaperClipOutlined />}
          disabled={disabled || isMaxFilesReached}
          className="w-64 mt-3 rounded-full!"
        >
          Upload File ({fileList.length}/{maxFiles})
        </Button>
      </Upload>
    </div>
  );
};

export default UploadFile;
