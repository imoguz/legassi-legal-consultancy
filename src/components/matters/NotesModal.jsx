"use client";

import React, { useState, useEffect, startTransition } from "react";
import { Modal, Button } from "antd";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import NoteForm from "./NoteForm";
import NoteDetail from "./NoteDetail";

export default function NotesModal({
  visible,
  note,
  mode,
  matterId,
  onClose,
  onModeChange,
}) {
  // Fullscreen is independently toggled by the user
  const [fullscreenState, setFullscreenState] = useState(false);

  // Derived fullscreen: if modal is closed, fullscreen always false
  const isFullscreen = visible ? fullscreenState : false;

  // Lock body scroll only when fullscreen active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    startTransition(() => {
      setFullscreenState((prev) => !prev);
    });
  };

  const isEditMode = mode === "edit" || mode === "create";
  const isViewMode = mode === "view";

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Add New Note";
      case "edit":
        return "Edit Note";
      case "view":
        return "Note Details";
      default:
        return "Note";
    }
  };

  const renderModalTitle = () => (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        {getModalTitle()}
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Button
          type="text"
          icon={
            isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
          onClick={toggleFullscreen}
          style={{
            fontSize: "20px",
            color: "#6b7280",
          }}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        />

        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          style={{
            fontSize: "20px",
            color: "#6b7280",
          }}
          title="Close"
        />
      </div>
    </div>
  );

  const handleCancel = () => {
    if (note && mode === "edit") {
      onModeChange("view");
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <Modal
      title={renderModalTitle()}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      mask={{ blur: false }}
      width={isFullscreen ? "100%" : 800}
      style={{
        top: isFullscreen ? 0 : 10,
        height: isFullscreen ? "100%" : undefined,
        maxWidth: isFullscreen ? "100%" : undefined,
        padding: isFullscreen ? 0 : undefined,
        borderRadius: isFullscreen ? 0 : undefined,
      }}
      styles={{
        body: {
          height: isFullscreen ? "100%" : undefined,
          overflow: isFullscreen ? "auto" : undefined,
          padding: isFullscreen ? "24px" : undefined,
        },
      }}
      closeIcon={false}
    >
      {isViewMode ? (
        <NoteDetail
          note={note}
          onEdit={() => onModeChange("edit")}
          onClose={onClose}
        />
      ) : (
        <NoteForm
          note={note}
          matterId={matterId}
          onCancel={handleCancel}
          onSave={handleSave}
          isFullscreen={isFullscreen}
        />
      )}
    </Modal>
  );
}
