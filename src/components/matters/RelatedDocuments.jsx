'use client';

import React, { useState } from 'react';
import {
  List,
  Avatar,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  Button,
  Divider,
  Upload,
  Select,
} from 'antd';
import {
  DeleteOutlined,
  FileTextOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { usePostDocumentMutation } from '@/rtk/api/documentApi';
import { matterCategoryOptions } from '@/utils/options';
import { notify } from '@/utils/helpers';

export default function RelatedDocumentsList({
  matterId,
  relatedDocuments,
  setRelatedDocuments,
  onRemove,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [postDocument, { isLoading }] = usePostDocumentMutation();

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      return notify.error('Error', 'Please select a file.');
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);
    formData.append('title', values.title);
    formData.append('category', values.category);
    formData.append('description', values.description);
    formData.append('documentType', 'private');
    formData.append('matterId', matterId);
    formData.append('fileSize', fileList[0].size);
    formData.append('fileType', fileList[0].type);

    try {
      const uploadedDoc = await postDocument(formData).unwrap();
      notify.success('Success', 'Document uploaded successfully.');
      setRelatedDocuments((prev) => [...prev, uploadedDoc]);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      notify.error(
        'Error',
        err?.data?.message || 'An error occurred while uploading the document.'
      );
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter a title.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          placeholder="Please select document category"
        >
          <Select options={matterCategoryOptions} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description.' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="dashed"
            htmlType="submit"
            loading={isLoading}
            disabled={fileList.length === 0}
            className="w-full"
          >
            Add File
          </Button>
        </Form.Item>
      </Form>

      <Divider orientation="left" className="text-base font-medium mt-6 mb-3">
        {relatedDocuments.length > 0
          ? `Attached Documents (${relatedDocuments.length})`
          : 'No Documents Attached Yet'}
      </Divider>

      <List
        itemLayout="horizontal"
        dataSource={relatedDocuments}
        locale={{ emptyText: 'No related documents.' }}
        renderItem={(item) => (
          <List.Item
            onMouseEnter={() => setHoveredId(item._id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group flex items-center justify-between"
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size={36}
                  icon={<FileTextOutlined />}
                  className="bg-blue-100 text-blue-500"
                />
              }
              title={
                <div className="font-semibold text-sm line-clamp-1">
                  {item.title}
                </div>
              }
              description={
                item.category && (
                  <div className="text-xs text-gray-500 -mt-1 line-clamp-1">
                    {item.category}
                  </div>
                )
              }
            />
            {hoveredId === item._id && (
              <Popconfirm
                title="Are you sure to remove this document?"
                onConfirm={() => onRemove(item._id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Remove Document">
                  <DeleteOutlined
                    className="text-red-500 cursor-pointer hover:scale-110 transition"
                    style={{ fontSize: 18 }}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </List.Item>
        )}
      />
    </>
  );
}
