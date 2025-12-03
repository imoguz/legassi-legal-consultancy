import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

const DEFAULT_PAGE_LIMIT = 20;

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Notifications', 'NotificationStats', 'NotificationCount'],
  endpoints: (builder) => ({
    // Create notification (admin only)
    createNotification: builder.mutation({
      query: (body) => ({
        url: '/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'Notifications',
        'NotificationStats',
        'NotificationCount',
      ],
    }),

    // List user's notifications
    getNotifications: builder.query({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_LIMIT,
        isRead,
        type,
        priority,
        startDate,
        endDate,
      } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (isRead !== undefined) params.append('isRead', isRead);
        if (type) params.append('type', type);
        if (priority) params.append('priority', priority);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        return {
          url: '/notifications',
          params,
        };
      },
      providesTags: (result) => {
        const tags = [
          'Notifications',
          'NotificationStats',
          'NotificationCount',
        ];

        if (result?.notifications) {
          tags.push(
            ...result.notifications.map(({ _id }) => ({
              type: 'Notifications',
              id: _id,
            }))
          );
        }

        return tags;
      },
      transformResponse: (response) => ({
        notifications: response.data?.notifications || [],
        total: response.data?.total || 0,
        unreadCount: response.data?.unreadCount || 0,
        currentPage: response.data?.currentPage || 1,
        totalPages: response.data?.totalPages || 1,
      }),
      keepUnusedDataFor: 60, // 1 minute cache
    }),

    getNotificationStats: builder.query({
      query: () => ({
        url: '/notifications/stats',
      }),
      providesTags: ['NotificationStats'],
      transformResponse: (response) => response.data || {},
    }),

    getNotificationById: builder.query({
      query: (id) => ({
        url: `/notifications/${id}`,
      }),
      providesTags: (result, error, id) => [
        { type: 'Notifications', id },
        'NotificationStats',
      ],
      transformResponse: (response) => response.data || {},
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notifications', id },
        'Notifications',
        'NotificationStats',
        'NotificationCount',
      ],

      onQueryStarted: async (id, { dispatch, queryFulfilled, getState }) => {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            'getNotifications',
            undefined,
            (draft) => {
              const notification = draft.notifications.find(
                (n) => n._id === id
              );
              if (notification) {
                notification.isRead = true;
              }
              draft.unreadCount = Math.max(0, draft.unreadCount - 1);
            }
          )
        );

        const statsPatch = dispatch(
          notificationApi.util.updateQueryData(
            'getNotificationStats',
            undefined,
            (draft) => {
              if (draft.summary) {
                draft.summary.unread = Math.max(0, draft.summary.unread - 1);
              }
              if (draft.byType) {
                const typeStat = draft.byType.find(
                  (stat) =>
                    stat._id === patchResult.arg.meta.arg.originalArgs?.type
                );
                if (typeStat) {
                  typeStat.unread = Math.max(0, typeStat.unread - 1);
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          statsPatch.undo();
        }
      },
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: [
        'Notifications',
        'NotificationStats',
        'NotificationCount',
      ],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            'getNotifications',
            undefined,
            (draft) => {
              draft.notifications.forEach((notification) => {
                notification.isRead = true;
              });
              draft.unreadCount = 0;
            }
          )
        );

        const statsPatch = dispatch(
          notificationApi.util.updateQueryData(
            'getNotificationStats',
            undefined,
            (draft) => {
              if (draft.summary) {
                draft.summary.unread = 0;
              }
              if (draft.byType) {
                draft.byType.forEach((stat) => {
                  stat.unread = 0;
                });
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          statsPatch.undo();
        }
      },
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notifications', id },
        'Notifications',
        'NotificationStats',
        'NotificationCount',
      ],
      onQueryStarted: async (id, { dispatch, queryFulfilled, getState }) => {
        // Get current state to check if notification was unread
        const state = getState();
        const notifications =
          notificationApi.endpoints.getNotifications.select()(state);
        const notification = notifications.data?.notifications?.find(
          (n) => n._id === id
        );

        const wasUnread = notification?.isRead === false;

        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            'getNotifications',
            undefined,
            (draft) => {
              draft.notifications = draft.notifications.filter(
                (n) => n._id !== id
              );
              if (wasUnread) {
                draft.unreadCount = Math.max(0, draft.unreadCount - 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getUnreadCount: builder.query({
      query: () => ({
        url: '/notifications/stats',
      }),
      transformResponse: (response) => response.data?.summary?.totalUnread || 0,
      providesTags: ['NotificationCount'],
    }),

    // Cleanup expired notifications (admin only)
    cleanupNotifications: builder.mutation({
      query: () => ({
        url: '/notifications/admin/cleanup',
        method: 'DELETE',
      }),
      invalidatesTags: [
        'Notifications',
        'NotificationStats',
        'NotificationCount',
      ],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useGetNotificationByIdQuery,
  useLazyGetNotificationByIdQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetUnreadCountQuery,
  useCleanupNotificationsMutation,
} = notificationApi;
