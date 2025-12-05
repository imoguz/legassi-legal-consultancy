'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { notification, message } from 'antd';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  notificationApi,
} from '@/rtk/api/notificationApi';
import { useRefreshTokenMutation } from '@/rtk/api/authApi';
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from '@/rtk/api/userApi';
import { socketService } from '@/utils/helpers/socket';
import { notify } from '@/utils/helpers';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [notificationStats, setNotificationStats] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const notificationSoundRef = useRef(null);

  const { data: notificationPreferences } = useGetNotificationPreferencesQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );

  const [updateNotificationPreferences] =
    useUpdateNotificationPreferencesMutation();

  const {
    data: notificationsData,
    refetch: refetchNotifications,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useGetNotificationsQuery(
    { page: 1, limit: 20 },
    {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
      pollingInterval: 300000,
    }
  );

  const { data: statsData, refetch: refetchStats } =
    useGetNotificationStatsQuery(undefined, {
      skip: !isAuthenticated,
    });

  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  useEffect(() => {
    socketService.setTokenRefreshCallback(async () => {
      const refreshToken = Cookies.get('icaRefreshToken');
      if (!refreshToken) return null;

      try {
        const res = await refreshTokenMutation(refreshToken).unwrap();
        if (res?.accessToken) {
          Cookies.set('icaAccessToken', res.accessToken, { expires: 7 });
          return res.accessToken;
        }
      } catch (err) {
        console.error('Socket token refresh error:', err);
        return null;
      }
    });
  }, [refreshTokenMutation]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSoundRef.current = new Audio('/notification.mp3');
      notificationSoundRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.notifications || []);
      setUnreadCount(notificationsData.unreadCount || 0);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (statsData) {
      setNotificationStats(statsData);
    }
  }, [statsData]);

  const filteredNotifications = useMemo(() => {
    if (!notificationPreferences) return notifications;

    return notifications.filter((notification) => {
      if (!notificationPreferences.inApp) return false;
      if (!notificationPreferences.types?.[notification.type]) return false;
      if (!notificationPreferences.priorities?.[notification.priority])
        return false;
      return true;
    });
  }, [notifications, notificationPreferences]);

  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      socketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
      setNotificationStats(null);
      return;
    }

    socketService.connect(token);

    const unsubscribeEvents = [
      socketService.on('connect', () => setIsSocketConnected(true)),
      socketService.on('disconnect', () => setIsSocketConnected(false)),
      socketService.on('new-notification', handleNewNotification),
      socketService.on('notification-read', (data) => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === data.notificationId
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(data.unreadCount);
      }),
      socketService.on('all-notifications-read', (data) => {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }),
      socketService.on('notification-deleted', (data) => {
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== data.notificationId)
        );
        setUnreadCount(data.unreadCount);
      }),
    ];

    return () => unsubscribeEvents.forEach((unsubscribe) => unsubscribe());
  }, [isAuthenticated, user, token]);

  const handleNewNotification = useCallback(
    (data) => {
      const { notification: newNotification, unreadCount: newUnreadCount } =
        data;

      const shouldShowNotification =
        notificationPreferences?.inApp !== false &&
        notificationPreferences?.types?.[newNotification.type] !== false &&
        notificationPreferences?.priorities?.[newNotification.priority] !==
          false;

      if (!shouldShowNotification) return;

      if (notificationSoundRef.current) {
        notificationSoundRef.current.play().catch(console.error);
      }

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount(newUnreadCount);

      dispatch(
        notificationApi.util.invalidateTags([
          'Notifications',
          'NotificationStats',
          'NotificationCount',
        ])
      );
    },
    [dispatch, notificationPreferences]
  );

  const handleMarkAsRead = useCallback(
    async (notification) => {
      if (notification.isRead) return;

      setActionLoading(notification._id);
      try {
        await markAsReadMutation(notification._id).unwrap();
      } catch (error) {
        message.error('Failed to mark notification as read');
      } finally {
        setActionLoading(null);
      }
    },
    [markAsReadMutation]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation().unwrap();
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  }, [markAllAsReadMutation]);

  const handleDeleteNotification = useCallback(
    async (notificationId) => {
      setActionLoading(notificationId);
      try {
        await deleteNotificationMutation(notificationId).unwrap();
      } catch (error) {
        message.error('Failed to delete notification');
      } finally {
        setActionLoading(null);
      }
    },
    [deleteNotificationMutation]
  );

  const handleNotificationNavigation = useCallback((notification) => {
    if (!notification.relatedId) {
      window.location.href = '/dashboard/notifications';
      return;
    }

    let path = '/dashboard';
    let queryParams = '';

    switch (notification.type) {
      case 'matter':
        path = `/dashboard/matters/${notification.relatedId}`;
        break;
      case 'task':
        path = `/dashboard/tasks`;
        queryParams = `?highlight=${notification.relatedId}`;
        break;
      case 'calendar':
        path = `/dashboard/calendar`;
        if (notification.relatedId)
          queryParams = `?event=${notification.relatedId}`;
        break;
      case 'document':
        path = `/dashboard/documents/${notification.relatedId}`;
        break;
      case 'reminder':
        path = `/dashboard/tasks`;
        queryParams = `?highlight=${notification.relatedId}`;
        break;
      default:
        path = '/dashboard/notifications';
    }

    const fullPath = path + queryParams;
    if (typeof window !== 'undefined') window.location.href = fullPath;
  }, []);

  const handleViewNotification = useCallback(
    async (notification) => {
      if (!notification.isRead) {
        try {
          await handleMarkAsRead(notification, false);
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      }
      handleNotificationNavigation(notification);
    },
    [handleMarkAsRead, handleNotificationNavigation]
  );

  const showNotification = useCallback(
    (type, title, description, options = {}) => {
      api[type]?.({
        message: title,
        description,
        duration: options.duration || 5,
        placement: options.placement || 'topRight',
        ...options,
      });
    },
    [api]
  );

  const handleUpdateNotificationPreferences = useCallback(
    async (updates) => {
      try {
        await updateNotificationPreferences(updates).unwrap();
        notify.success('Success', 'Notification preferences updated');
      } catch (error) {
        notify.error('Error', 'Failed to update notification preferences');
        throw error;
      }
    },
    [updateNotificationPreferences]
  );

  const contextValue = useMemo(
    () => ({
      notifications: filteredNotifications,
      unreadCount,
      notificationStats,
      isSocketConnected,
      notificationsLoading,
      notificationsError,
      actionLoading,
      refetchNotifications,
      refetchStats,
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
      deleteNotification: handleDeleteNotification,
      viewNotification: handleViewNotification,
      navigateToNotification: handleNotificationNavigation,
      showNotification,
      socketService,
      notificationPreferences,
      updateNotificationPreferences: handleUpdateNotificationPreferences,
    }),
    [
      filteredNotifications,
      unreadCount,
      notificationStats,
      isSocketConnected,
      notificationsLoading,
      notificationsError,
      actionLoading,
      refetchNotifications,
      refetchStats,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
      handleViewNotification,
      handleNotificationNavigation,
      showNotification,
      notificationPreferences,
      handleUpdateNotificationPreferences,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
