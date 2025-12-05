'use client';

import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';

const { Dragger } = Upload;

export default function FileUploader({ value = [], onChange }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const allowedTypes = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
  ];

  const maxSizeMB = 10;

  const beforeUpload = (file) => {
    const isAllowedType = allowedTypes.includes(file.type);
    const isUnderLimit = file.size / 1024 / 1024 < maxSizeMB;

    if (!isAllowedType) {
      message.error(`Only ${allowedTypes.join(', ')} files are allowed.`);
      return false;
    }

    if (!isUnderLimit) {
      message.error(`File must be smaller than ${maxSizeMB}MB.`);
      return false;
    }

    onChange?.([file]);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleRemove = () => {
    onChange?.([]);
    setPreviewUrl(null);
  };

  return (
    <div>
      <Dragger
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        fileList={value}
        maxCount={1}
        accept={allowedTypes.join(',')}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Drag and drop a file here or click to select
        </p>
        <p className="ant-upload-hint">
          Only one file can be uploaded. Max size: {maxSizeMB}MB.
        </p>
      </Dragger>

      {previewUrl && (
        <div className="mt-4 border rounded p-3 bg-gray-50">
          <h3 className="font-semibold mb-2">Preview</h3>
          {value[0]?.type?.startsWith('image') ? (
            <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
          ) : value[0]?.type === 'application/pdf' ? (
            <iframe src={previewUrl} width="100%" height="300px" />
          ) : (
            <p className="text-gray-600">
              Preview is not supported for this file type.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
