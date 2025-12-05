"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Image } from "antd";
const loadPDFCss = async () => {
  await import("@react-pdf-viewer/core/lib/styles/index.css");
  await import("@react-pdf-viewer/default-layout/lib/styles/index.css");
};

// Dynamic PDF Viewer
const PDFViewer = dynamic(
  async () => {
    await loadPDFCss();
    const { Viewer, Worker } = await import("@react-pdf-viewer/core");
    const { defaultLayoutPlugin } = await import(
      "@react-pdf-viewer/default-layout"
    );

    return function PDFViewerComponent({ fileUrl }) {
      const plugin = defaultLayoutPlugin();
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="h-full w-full">
            <Viewer
              fileUrl={fileUrl}
              plugins={[plugin]}
              renderLoader={() => (
                <div className="flex items-center justify-center h-full">
                  <Spin size="large" />
                </div>
              )}
            />
          </div>
        </Worker>
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" tip="Loading PDF viewer..." />
      </div>
    ),
  }
);

const DocPreview = ({ image, onClose }) => {
  const [cssLoaded, setCssLoaded] = useState(false);

  const isImage = image?.mimeType?.startsWith("image/");
  const isPDF = image?.mimeType === "application/pdf";

  useEffect(() => {
    if (isPDF && !cssLoaded) {
      loadPDFCss().then(() => setCssLoaded(true));
    }
  }, [isPDF, cssLoaded]);

  const renderPreviewContent = () => {
    if (isImage) {
      return (
        <div className="flex justify-center items-center py-3">
          <Image
            width={800}
            alt="basic"
            src={image?.url}
            preview={{
              mask: { blur: false },
            }}
            fallback="/file-image.png"
          />
        </div>
      );
    }

    if (isPDF) {
      return <PDFViewer fileUrl={image?.url} />;
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
    <div className="fixed inset-0 bg-white flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between py-2 px-8 bg-[#eeeeee]">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {image?.filename || image?.originalName || "Preview"}
          </span>
          <span className="text-sm text-gray-500">
            {isImage ? "Image " : isPDF ? "PDF Document " : "File "} •{" "}
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
