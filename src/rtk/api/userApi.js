import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Users', 'NotificationPreferences'],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
        meta: { skipAuth: true },
      }),
      invalidatesTags: ['Users'],
    }),

    getUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    getStaff: builder.query({
      query: () => ({
        url: '/users/staff',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users' },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
    }),

    purgeUser: builder.mutation({
      query: (id) => ({
        url: `/users/purge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users' },
      ],
    }),

    getNotificationPreferences: builder.query({
      query: () => ({
        url: '/users/notification-preferences',
        method: 'GET',
      }),
      providesTags: ['NotificationPreferences'],
      transformResponse: (response) => response.data || {},
    }),

    updateNotificationPreferences: builder.mutation({
      query: (body) => ({
        url: '/users/notification-preferences',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['NotificationPreferences'],
      // Optimistic update
      onQueryStarted: async (preferences, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userApi.util.updateQueryData(
            'getNotificationPreferences',
            undefined,
            (draft) => {
              Object.assign(draft, preferences);
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
  }),
});

export const {
  useCreateUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useGetStaffQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePurgeUserMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = userApi;
