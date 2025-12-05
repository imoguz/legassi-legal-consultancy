'use client';

import React, { memo, useCallback } from 'react';
import { Button, Modal } from 'antd';
import { InfoOutlined } from '@ant-design/icons';

const { error: showErrorModal } = Modal;

const UnsavedDraftWarning = ({ onSave, onDiscard, visible = true }) => {
  const handleDiscard = useCallback(() => {
    showErrorModal({
      title: 'Discard all unsaved changes',
      content:
        'If you discard changes, you will lose any edits made since your last save.',
      okText: 'Discard Changes',
      okType: 'danger',
      cancelText: 'Continue Editing',
      onOk: () => {
        if (typeof onDiscard === 'function') {
          onDiscard();
        }
      },
    });
  }, [onDiscard]);

  if (!visible) return null;

  return (
    <div className="flex justify-between items-center bg-black text-white py-3 px-4 rounded mb-4">
      <div className="flex items-center font-semibold">
        <InfoOutlined className="mr-2 w-6 h-6" />
        Unsaved draft
      </div>
      <div className="flex gap-2">
        <Button danger onClick={handleDiscard}>
          Discard
        </Button>
        <Button type="primary" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default memo(UnsavedDraftWarning);
