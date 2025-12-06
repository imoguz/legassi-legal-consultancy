"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Switch,
  Button,
  Space,
  Divider,
  message,
  Avatar,
} from "antd";
import {
  PushpinOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAddNoteMutation, useUpdateNoteMutation } from "@/rtk/api/matterApi";
import { notify } from "@/utils/helpers";
import UploadFile from "@/components/common/UploadFile";
import { useGetStaffQuery } from "@/rtk/api/userApi";
import dayjs from "dayjs";
import {
  quillFormats,
  quillModules,
  VISIBILITY_OPTIONS,
} from "@/utils/options";

export default function NoteForm({
  note,
  matterId,
  onCancel,
  onSave,
  isSubmitting = false,
  isFullscreen = false,
}) {
  const [form] = Form.useForm();
  const [quillValue, setQuillValue] = useState("");
  const [fileList, setFileList] = useState([]);
  const [selectedVisibility, setSelectedVisibility] = useState("internal");

  const [addNote, { isLoading: isAdding }] = useAddNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const { data: staffData, isLoading: usersLoading } = useGetStaffQuery();

  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    if (!staffData) return;
    setStaffOptions(
      staffData.map((user) => ({
        label: `${user.firstname} ${user.lastname} (${user.position})`,
        value: user._id,
      }))
    );
  }, [staffData]);

  useEffect(() => {
    if (note) {
      const content = note?.contentHtml || "";
      setQuillValue(content);
      setSelectedVisibility(note?.visibility || "internal");

      const formattedFiles = (note?.attachments || []).map((attachment) => ({
        ...attachment,
        uid: attachment._id,
        _id: attachment._id,
        name: attachment.filename || attachment.name || `Attachment`,
        status: "done",
        url: attachment.url || attachment.path,
      }));

      setFileList(formattedFiles);

      const permittedUserIds = (note?.permittedUsers || []).map((user) =>
        typeof user === "object" ? user._id : user
      );

      form.setFieldsValue({
        visibility: note?.visibility || "internal",
        pinned: note?.pinned || false,
        contentHtml: content,
        permittedUsers: permittedUserIds,
      });
    } else {
      setQuillValue("");
      setFileList([]);
      setSelectedVisibility("internal");
      form.setFieldsValue({
        visibility: "internal",
        pinned: false,
        contentHtml: "",
        permittedUsers: [],
      });
    }
  }, [note, form]);

  useEffect(() => {
    form.setFieldValue("contentHtml", quillValue);
  }, [quillValue, form]);

  const handleSave = async (values) => {
    if (!quillValue.trim()) {
      notify.warning("Warning", "Note content is required.");
      return;
    }

    if (!matterId) {
      notify.warning("Warning", "Matter ID is missing.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("contentHtml", quillValue);
      formData.append("visibility", values.visibility || "internal");
      formData.append("pinned", values.pinned || false);

      if (values.visibility === "restricted" && values.permittedUsers) {
        values.permittedUsers.forEach((userId) => {
          formData.append("permittedUsers", userId);
        });
      }

      const newFiles = fileList.filter((file) => file.originFileObj);
      newFiles.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      if (note) {
        const originalFiles = note.attachments || [];
        const remainingFiles = fileList.filter(
          (file) => (file._id || file.uid) && !file.originFileObj
        );

        const deletedFiles = originalFiles.filter(
          (originalFile) =>
            !remainingFiles.some(
              (file) =>
                (file._id && file._id === originalFile._id) ||
                (file.uid && file.uid === originalFile._id)
            )
        );

        deletedFiles.forEach((file) => {
          if (file._id) {
            formData.append("deletedAttachments", file._id);
          }
        });

        if (deletedFiles.length === 0) {
          formData.append("deletedAttachments", "[]");
        }

        await updateNote({
          matterId,
          noteId: note._id,
          formData,
        }).unwrap();
        notify.success("Success", "Note updated successfully.");
      } else {
        await addNote({
          matterId,
          formData,
        }).unwrap();
        notify.success("Success", "Note created successfully.");
      }

      onSave?.();
    } catch (error) {
      console.error("Note save error:", error);
      message.error("Failed to save note");
      notify.error("Error", "Failed to save note.");
    }
  };

  const handleFileListChange = (newFileList) => {
    setFileList(newFileList);
  };

  const handleVisibilityChange = (value) => {
    setSelectedVisibility(value);
  };

  const renderHeaderInfo = () => {
    if (!note) return null;

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

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSave}
      disabled={isSubmitting}
    >
      {renderHeaderInfo()}

      <Form.Item
        name="contentHtml"
        label="Note Content"
        rules={[{ required: true, message: "Note content is required" }]}
      >
        <ReactQuill
          key={note?._id || "new"}
          theme="snow"
          value={quillValue}
          onChange={setQuillValue}
          modules={quillModules}
          formats={quillFormats}
          style={{
            height: isFullscreen ? "400px" : "200px",
            marginBottom: "50px",
          }}
          placeholder="Write your note here..."
        />
      </Form.Item>

      <Space size="large" align="start">
        <Form.Item name="visibility" label="Visibility" className="!mb-0">
          <Select style={{ width: 160 }} onChange={handleVisibilityChange}>
            {VISIBILITY_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="pinned"
          valuePropName="checked"
          label="Pin Note"
          className="!mb-0"
        >
          <Switch
            checkedChildren={<PushpinOutlined />}
            unCheckedChildren={<PushpinOutlined />}
          />
        </Form.Item>
      </Space>

      {selectedVisibility === "restricted" && (
        <Form.Item
          name="permittedUsers"
          label="Permitted Users"
          rules={[
            {
              required: true,
              message: "Please select at least one user for restricted notes",
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select users who can view this note"
            loading={usersLoading}
            optionLabelProp="label"
          >
            {staffOptions.map((opt) => (
              <Select.Option
                key={opt.value}
                value={opt.value}
                label={opt.label}
              >
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Divider />

      <Form.Item label="Attachments">
        <UploadFile
          fileList={fileList}
          onChange={handleFileListChange}
          maxFiles={5}
          disabled={isSubmitting}
        />
      </Form.Item>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Maximum 5 files can be uploaded
        </div>

        <Space>
          <Button
            onClick={onCancel}
            disabled={isSubmitting}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            icon={<SaveOutlined />}
          >
            {note ? "Update" : "Save"}
          </Button>
        </Space>
      </div>
    </Form>
  );
}
