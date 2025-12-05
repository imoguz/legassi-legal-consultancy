'use client';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const DocPreview = ({ image, onClose }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const isImage = image?.mimeType?.startsWith('image/');
  const isPDF = image?.mimeType === 'application/pdf';

  const renderPreviewContent = () => {
    if (isImage) {
      return (
        <div className="flex justify-center items-center h-full">
          <img
            src={image?.url}
            alt={image?.filename || image?.originalName || 'Preview'}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="h-full w-full">
            <Viewer
              fileUrl={image?.url}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="text-6xl mb-4">📄</div>
        <div className="text-xl font-semibold mb-2">Cannot Preview</div>
        <div className="text-sm">
          This file type is not supported for preview
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-100">
      {/* Header */}
      <div className="flex items-center justify-between py-2 px-8 bg-[#eeeeee] shadow-sm">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {image?.filename || image?.originalName || 'Preview'}
          </span>
          <span className="text-sm text-gray-500">
            {isImage ? 'Image' : isPDF ? 'PDF Document' : 'File'} •
            {Math.round(image?.size / 1024)} KB
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(isImage || isPDF) && (
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              href={image?.url}
              download={image?.filename || image?.originalName}
              target="_blank"
            >
              Download
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">{renderPreviewContent()}</div>
    </div>
  );
};

export default DocPreview;
