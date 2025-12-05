'use client';

import React from 'react';
import { Upload, Button, Space, List } from 'antd';
import {
  PaperClipOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

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
      window.open(file.url, '_blank');
    } else if (file.originFileObj) {
      const url = URL.createObjectURL(file.originFileObj);
      window.open(url, '_blank');
    }
  };

  // Maksimum dosya sayısı kontrolü
  const isMaxFilesReached = fileList.length >= maxFiles;

  return (
    <div className="space-y-4">
      <Upload
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={(file, fileList) => {
          if (fileList.length + existingFiles.length > maxFiles) {
            notify.warning(
              'Warning',
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
      >
        <Button
          icon={<PaperClipOutlined />}
          disabled={disabled || isMaxFilesReached}
        >
          Upload File ({fileList.length}/{maxFiles})
        </Button>
      </Upload>

      {fileList.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <Space direction="vertical" className="w-full">
            {fileList.map((file, index) => (
              <div
                key={file.uid || file._id || index}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <div className="flex items-center gap-2 flex-1">
                  <PaperClipOutlined className="text-gray-400" />
                  <span className="text-sm text-gray-700 flex-1">
                    {file.name || file.filename || `Dosya ${index + 1}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {file.size
                      ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)`
                      : ''}
                  </span>
                </div>
                <Space>
                  {(file.url || file.originFileObj) && (
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(file)}
                      title="Önizleme"
                    />
                  )}
                  {!disabled && (
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(file)}
                      title="Sil"
                    />
                  )}
                </Space>
              </div>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
