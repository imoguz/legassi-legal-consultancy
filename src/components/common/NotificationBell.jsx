"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  ReloadOutlined,
  WarningOutlined,
  SettingOutlined,
  BarsOutlined,
  AimOutlined,
  CalendarOutlined,
  FileOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Dropdown,
  List,
  Button,
  Spin,
  Tooltip,
  Typography,
  Tag,
  Avatar,
  Switch,
} from "antd";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

const { Text, Paragraph } = Typography;

const NotificationBell = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    isSocketConnected,
    notificationsLoading,
    markAllAsRead,
    deleteNotification,
    viewNotification,
    actionLoading,
    refetchNotifications,
    notificationPreferences,
    updateNotificationPreferences,
  } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuickToggle = async (key, value) => {
    try {
      await updateNotificationPreferences({ [key]: value });
    } catch (error) {
      console.error("Failed to update notification preference:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    viewNotification(notification);
    setDropdownOpen(false);
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "#ef4444",
      high: "#f97316",
      medium: "#facc15",
      low: "#22c55e",
    };
    return colors[priority] || "#d9d9d9";
  };

  const getTypeIcon = (type) => {
    const icons = {
      task: <BarsOutlined />,
      matter: <AimOutlined />,
      calendar: <CalendarOutlined />,
      document: <FileOutlined />,
      reminder: <FieldTimeOutlined />,
    };
    return icons[type] || <BellOutlined />;
  };

  const getPriorityText = (priority) => {
    const texts = {
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
    };
    return texts[priority] || "Medium";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US");
  };

  const notificationContent = (
    <div className="w-[420px] max-h-[500px] overflow-auto" ref={dropdownRef}>
      {/* Quick Settings */}
      <div className="px-4 py-3 border-solid border-0 border-b  border-gray-200 bg-sky-100">
        <div className="flex justify-between items-center mb-2">
          <Text strong>Notifications</Text>
          <div className="flex items-center gap-1">
            {!isSocketConnected && (
              <Tooltip title="Socket connection lost">
                <WarningOutlined className="text-red-500" />
              </Tooltip>
            )}
            <Tooltip title="Notification Settings">
              <Button
                type="text"
                icon={<SettingOutlined />}
                size="small"
                onClick={() => {
                  router.push("/dashboard/notifications");
                  setDropdownOpen(false);
                }}
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div>
            <Text type="secondary">In-App: </Text>
            <Switch
              size="small"
              checked={notificationPreferences?.inApp !== false}
              onChange={(checked) => handleQuickToggle("inApp", checked)}
            />
          </div>
          {unreadCount > 0 && (
            <Tag color="blue" className="text-[11px]">
              {unreadCount} unread
            </Tag>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-0 border-solid border-b border-gray-200 flex justify-between items-center bg-white">
        <Tooltip title="Mark all as read">
          <Button
            type="text"
            icon={<CheckOutlined />}
            size="small"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
        </Tooltip>
        <Tooltip title="Refresh">
          <Button
            type="text"
            icon={<ReloadOutlined />}
            size="small"
            onClick={refetchNotifications}
            loading={notificationsLoading}
          >
            Refresh
          </Button>
        </Tooltip>
      </div>

      {notificationsLoading ? (
        <div className="text-center py-5 text-gray-500">
          <Spin size="small" />
          <div className="mt-2 text-sm">Loading notifications...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-5 text-gray-500 bg-white">
          <BellOutlined className="text-2xl mb-2" />
          <div>No notifications yet</div>
          {notificationPreferences?.inApp === false && (
            <Text type="secondary" className="block text-xs mt-2">
              In-app notifications are disabled
            </Text>
          )}
        </div>
      ) : (
        <List
          size="small"
          dataSource={notifications.slice(0, 8)}
          renderItem={(notification) => (
            <List.Item
              key={notification._id}
              className={`relative group px-4 py-3 transition-all duration-200 border-b border-solidborder-gray-300 ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              }
              ${
                notification.metadata.actionable
                  ? "cursor-pointer"
                  : "cursor-default"
              }
              `}
              onClick={() => {
                if (notification.metadata?.actionable !== false) {
                  handleNotificationClick(notification);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead
                  ? "#f5f5f5"
                  : "#e6f7ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = notification.isRead
                  ? "#fff"
                  : "#f0f9ff";
              }}
            >
              {actionLoading === notification._id && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                  <Spin size="small" />
                </div>
              )}

              <List.Item.Meta
                avatar={
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: getPriorityColor(notification.priority),
                      fontSize: "12px",
                    }}
                  >
                    {getTypeIcon(notification.type)}
                  </Avatar>
                }
                title={
                  <div className="flex justify-between items-start">
                    <Text
                      strong={!notification.isRead}
                      className="text-[13px] flex-1 mr-2"
                      ellipsis={{ tooltip: notification.title }}
                    >
                      {notification.title}
                    </Text>
                    <div className="mr-4">
                      <div className="flex flex-col gap-0.5">
                        <Text type="secondary" className="text-[10px]">
                          {formatDate(notification.createdAt)}
                        </Text>
                        {notification.priority !== "medium" && (
                          <Tag
                            color={getPriorityColor(notification.priority)}
                            className="text-[9px] leading-3 h-4 m-0 border-0"
                          >
                            {getPriorityText(notification.priority)}
                          </Tag>
                        )}
                      </div>
                      <Button
                        key="delete"
                        variant="text"
                        color="danger"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) =>
                          handleDeleteNotification(e, notification._id)
                        }
                        loading={actionLoading === notification._id}
                        disabled={actionLoading === notification._id}
                        className="invisible group-hover:visible absolute top-1 right-1 transition-none"
                      />
                    </div>
                  </div>
                }
                description={
                  <Paragraph
                    type="secondary"
                    className="text-[12px] leading-relaxed"
                    ellipsis={{ tooltip: notification.message, rows: 2 }}
                    style={{ marginBottom: 0 }}
                  >
                    {notification.message}
                  </Paragraph>
                }
              />
            </List.Item>
          )}
        />
      )}

      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 text-center bg-gray-50">
          <Button
            type="link"
            onClick={() => {
              router.push("/dashboard/notifications");
              setDropdownOpen(false);
            }}
            className="font-medium"
          >
            View All Notifications ({notifications.length})
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div ref={dropdownRef} className="mt-2">
      <Dropdown
        open={dropdownOpen}
        onOpenChange={(open) => {
          if (open) refetchNotifications();
          setDropdownOpen(open);
        }}
        popupRender={() => notificationContent}
        placement="bottomRight"
        trigger={["click"]}
        styles={{
          root: { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
        }}
      >
        <Badge
          count={notificationPreferences?.inApp !== false ? unreadCount : 0}
          size="small"
          offset={[-4, 8]}
          overflowCount={9}
        >
          <Button
            type="text"
            icon={
              <BellOutlined
                className={`text-xl mt-1 mr-1 transition-colors ${
                  unreadCount > 0 && notificationPreferences?.inApp !== false
                    ? "text-white!"
                    : "text-gray-200!"
                } ${
                  notificationPreferences?.inApp === false ? "opacity-40" : ""
                }`}
              />
            }
            shape="circle"
            className=" relative w-10 h-10 flex items-center justify-center"
          >
            {!isSocketConnected && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white notification-bell-pulse" />
            )}
          </Button>
        </Badge>
      </Dropdown>
    </div>
  );
};

export default NotificationBell;
