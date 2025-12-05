'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Divider,
  Switch,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons';

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTaskMattersQuery,
} from '@/rtk/api/taskApi';

import { useGetStaffQuery } from '@/rtk/api/userApi';
import { notify } from '@/utils/helpers';
import dayjs from 'dayjs';

import VisibilitySelector from '@/components/common/VisibilitySelector';
import UploadFile from '@/components/common/UploadFile';

const { TextArea, Option } = Input;

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open', color: 'blue' },
  { value: 'in-progress', label: 'In Progress', color: 'orange' },
  { value: 'waiting', label: 'Waiting', color: 'gold' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

const ChecklistItem = ({ item, index, items, onChange, onRemove, mode }) => (
  <div className="flex items-center gap-3">
    <Checkbox
      checked={item.completed}
      onChange={(e) => onChange(index, 'completed', e.target.checked)}
      disabled={mode === 'create'}
    />
    <Input
      placeholder={`Checklist item ${index + 1}`}
      value={item.title}
      onChange={(e) => onChange(index, 'title', e.target.value)}
      size="large"
      className="flex-1"
    />
    {items.length > 1 && (
      <Button
        type="text"
        danger
        icon={<MinusCircleOutlined />}
        onClick={() => onRemove(index)}
      />
    )}
  </div>
);

const AssigneeItem = ({
  index,
  assignee,
  formattedStaff,
  onChange,
  onRemove,
  availableStaff,
}) => {
  const selected = formattedStaff.find((s) => s.value === assignee.userId);

  return (
    <div className="flex items-center gap-3">
      <Select
        placeholder="Select team member"
        value={
          assignee.userId
            ? { value: assignee.userId, label: selected?.label }
            : null
        }
        onChange={(v) => onChange(index, 'userId', v?.value)}
        style={{ flex: 1 }}
        options={availableStaff}
        showSearch
        optionFilterProp="label"
        size="large"
        labelInValue
      />

      <Select
        value={assignee.isPrimary}
        onChange={(v) => onChange(index, 'isPrimary', v)}
        size="large"
        style={{ width: 140 }}
        options={[
          { label: 'Contributor', value: false },
          { label: 'Primary', value: true },
        ]}
      />

      <Button
        type="text"
        danger
        icon={<MinusCircleOutlined />}
        onClick={() => onRemove(index)}
      />
    </div>
  );
};

export default function TaskModal({ visible, onClose, task, mode = 'create' }) {
  const [form] = Form.useForm();
  const [createTask, { isLoading: loadingCreate }] = useCreateTaskMutation();
  const [updateTask, { isLoading: loadingUpdate }] = useUpdateTaskMutation();

  const [assignees, setAssignees] = useState([]);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState([
    { title: '', completed: false },
  ]);
  const [fileList, setFileList] = useState([]);

  const isLoading = loadingCreate || loadingUpdate;

  const { data: matters } = useGetTaskMattersQuery();
  const { data: staff } = useGetStaffQuery();

  const matterOptions = useMemo(
    () =>
      (matters?.data || []).map((m) => ({
        value: m._id,
        label: m.matterNumber ? `${m.title} (${m.matterNumber})` : m.title,
      })),
    [matters]
  );

  const staffOptions = useMemo(
    () =>
      (staff || []).map((s) => ({
        value: s._id,
        label: `${s.firstname} ${s.lastname} (${s.position})`,
      })),
    [staff]
  );

  const getAvailableStaff = () => {
    const used = assignees.map((a) => a.userId).filter(Boolean);
    return staffOptions.filter((s) => !used.includes(s.value));
  };

  useEffect(() => {
    if (!visible) return;

    if (task && mode === 'edit') {
      setAssignees(
        (task.assignees || []).map((a) => ({
          userId: a.user?._id,
          isPrimary: a.isPrimary,
        }))
      );

      const hasList = task.checklist?.length > 0;
      setHasChecklist(hasList);
      setChecklistItems(
        hasList ? task.checklist : [{ title: '', completed: false }]
      );

      setFileList(
        (task.attachments || []).map((f) => ({
          ...f,
          uid: f._id,
          status: 'done',
          name: f.filename || f.name,
          url: f.url || f.path,
        }))
      );

      form.setFieldsValue({
        title: task.title,
        description: task.description,
        matter: task.matter?._id,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        estimatedMinutes: task.estimatedMinutes,
        visibility: task.visibility,
        permittedUsers: task.permittedUsers?.map((u) => u._id || u),
      });
    } else {
      form.resetFields();
      setAssignees([]);
      setHasChecklist(false);
      setChecklistItems([{ title: '', completed: false }]);
      setFileList([]);
    }
  }, [visible]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      Object.entries({
        title: values.title,
        description: values.description || '',
        matter: values.matter,
        priority: values.priority,
        visibility: values.visibility,
        status: values.status || 'open',
      }).forEach(([k, v]) => formData.append(k, v));

      if (values.dueDate)
        formData.append('dueDate', values.dueDate.toISOString());
      if (values.estimatedMinutes)
        formData.append('estimatedMinutes', values.estimatedMinutes);

      // assignees
      assignees.forEach((a, i) => {
        if (!a.userId) return;
        formData.append(`assignees[${i}][user]`, a.userId);
        formData.append(`assignees[${i}][isPrimary]`, a.isPrimary);
      });

      // permitted users
      (values.permittedUsers || []).forEach((u) =>
        formData.append('permittedUsers', u)
      );

      // checklist
      if (hasChecklist) {
        checklistItems
          .filter((i) => i.title.trim())
          .forEach((i, idx) => {
            formData.append(`checklist[${idx}][title]`, i.title.trim());
            formData.append(`checklist[${idx}][completed]`, i.completed);
            if (i._id) formData.append(`checklist[${idx}][_id]`, i._id);
          });
      }

      // files
      const newFiles = fileList.filter((f) => f.originFileObj);
      newFiles.forEach((f) => formData.append('files', f.originFileObj));

      // deleted files (edit mode)
      if (mode === 'edit' && task) {
        const original = task.attachments || [];
        const remaining = fileList.filter((f) => f._id && !f.originFileObj);

        const deleted = original.filter(
          (orig) => !remaining.some((r) => r._id === orig._id)
        );

        deleted.forEach((d) => formData.append('deletedAttachments', d._id));
      }

      if (mode === 'create') {
        await createTask(formData).unwrap();
        notify.success('Success', 'Task created successfully');
      } else {
        await updateTask({ id: task._id, formData }).unwrap();
        notify.success('Success', 'Task updated successfully');
      }

      handleCancel();
    } catch (err) {
      console.error(err);
      notify.error('Error', `Failed to ${mode} task`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAssignees([]);
    setHasChecklist(false);
    setChecklistItems([{ title: '', completed: false }]);
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      open={visible}
      width={700}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      mask={{ blur: false }}
      title={
        <div className="flex items-center gap-2">
          {mode === 'create' ? <PlusOutlined /> : <EditOutlined />}
          <span>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</span>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: 'medium',
          status: 'open',
          visibility: 'internal',
        }}
      >
        <div className="space-y-4">
          {/* Title */}
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter task title' }]}
          >
            <Input placeholder="Enter task title" size="large" />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label="Description">
            <TextArea
              rows={3}
              maxLength={1000}
              placeholder="Describe the task..."
            />
          </Form.Item>

          {/* Matter + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="matter"
              label="Related Matter"
              rules={[{ required: true, message: 'Please select a matter' }]}
            >
              <Select
                size="large"
                options={matterOptions}
                placeholder="Select matter"
                loading={!matterOptions.length}
                showSearch={{
                  optionFilterProp: 'label',
                }}
              />
            </Form.Item>

            <Form.Item name="priority" label="Priority">
              <Select size="large">
                {PRIORITY_OPTIONS.map((o) => (
                  <Select.Option key={o.value} value={o.value}>
                    <Space>
                      <div
                        className={`w-2 h-2 rounded-full bg-${o.color}-500`}
                      />
                      {o.label}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Status – only in edit */}
          {mode === 'edit' && (
            <Form.Item name="status" label="Status">
              <Select size="large">
                {STATUS_OPTIONS.map((o) => (
                  <Select.Option key={o.value} value={o.value}>
                    <Space>
                      <div
                        className={`w-2 h-2 rounded-full bg-${o.color}-500`}
                      />
                      {o.label}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Assignees */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">Assignees</div>
            </div>

            <div className="space-y-3">
              {assignees.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                  <UserOutlined className="text-2xl text-gray-400 mb-2" />
                  <div className="text-gray-600">No assignees added</div>
                </div>
              ) : (
                assignees.map((a, i) => (
                  <AssigneeItem
                    key={i}
                    index={i}
                    assignee={a}
                    formattedStaff={staffOptions}
                    availableStaff={getAvailableStaff()}
                    onChange={(i2, field, v) =>
                      setAssignees((p) =>
                        p.map((x, idx) =>
                          idx === i2 ? { ...x, [field]: v } : x
                        )
                      )
                    }
                    onRemove={(idx) =>
                      setAssignees((p) => p.filter((_, i2) => i2 !== idx))
                    }
                  />
                ))
              )}
            </div>
            <div className="w-full flex justify-center">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                className="w-full max-w-64 mt-2 rounded-full"
                onClick={() =>
                  setAssignees((p) => [
                    ...p,
                    { userId: null, isPrimary: false },
                  ])
                }
                disabled={!getAvailableStaff().length}
              >
                Add Assignee
              </Button>
            </div>
          </div>

          <Divider />

          {/* Checklist */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-medium">Checklist</div>
                <div className="text-sm text-gray-500">Break down the task</div>
              </div>
              <Switch
                checked={hasChecklist}
                onChange={(v) => {
                  setHasChecklist(v);
                  if (!v) setChecklistItems([{ title: '', completed: false }]);
                }}
              />
            </div>

            {hasChecklist && (
              <div className="space-y-3">
                {checklistItems.map((item, i) => (
                  <ChecklistItem
                    key={i}
                    item={item}
                    index={i}
                    items={checklistItems}
                    onChange={(idx, key, v) =>
                      setChecklistItems((p) =>
                        p.map((x, ii) => (ii === idx ? { ...x, [key]: v } : x))
                      )
                    }
                    onRemove={(idx) =>
                      setChecklistItems((p) => p.filter((_, ii) => ii !== idx))
                    }
                    mode={mode}
                  />
                ))}
                <div className="w-full flex justify-center">
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    className="w-full max-w-64 mt-2 rounded-full"
                    onClick={() =>
                      setChecklistItems((p) => [
                        ...p,
                        { title: '', completed: false },
                      ])
                    }
                    block
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                size="large"
                style={{ width: '100%' }}
                disabledDate={(d) => d && d < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item name="estimatedMinutes" label="Estimated Minutes">
              <Space.Compact>
                <InputNumber
                  min={0}
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="120"
                />
                <Space.Addon>min</Space.Addon>
              </Space.Compact>
            </Form.Item>
          </div>

          <VisibilitySelector />

          <Divider />

          {/* Attachments */}
          <Form.Item label="Attachments">
            <UploadFile
              fileList={fileList}
              onChange={setFileList}
              maxFiles={5}
              disabled={isLoading}
            />
          </Form.Item>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            icon={mode === 'create' ? <PlusOutlined /> : <EditOutlined />}
          >
            {mode === 'create' ? 'Create Task' : 'Update Task'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
