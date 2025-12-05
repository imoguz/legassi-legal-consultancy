'use client';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Modal, Tag } from 'antd';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = ({ openPdfViwer, fileUrl, onClose, title }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Modal
      title={
        <Tag color="geekblue" className="text-xs">
          {title || 'Document Preview'}
        </Tag>
      }
      centered
      transitionName="ant-fade"
      open={openPdfViwer}
      onCancel={onClose}
      footer={null}
      width={{
        xs: '95%',
        sm: '90%',
        md: '80%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      styles={{
        header: {
          fontSize: 12,
          background: 'transparent',
          borderBottom: 'none',
        },
        body: {
          height: '60vh',
          padding: 0,
          background: 'transparent',
        },
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div className="h-full">
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </Worker>
    </Modal>
  );
};

export default PdfViewer;
