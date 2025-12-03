import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

const DEFAULT_PAGE_LIMIT = 20;

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Tasks', 'TaskMatters', 'TaskStats'],
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    getTaskById: builder.query({
      query: (id) => ({
        url: `/tasks/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
    }),

    getTasks: builder.query({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_LIMIT,
        sortBy,
        sortOrder,
        search,
        filters = {},
      } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);
        if (search) params.append('search', search);

        Object.entries(filters).forEach(([key, value]) => {
          if (value != null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v));
            } else {
              params.append(key, value);
            }
          }
        });

        return {
          url: '/tasks',
          params,
        };
      },
      providesTags: ['Tasks'],
    }),

    updateTask: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        { type: 'Tasks' },
      ],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Tasks', id },
        { type: 'Tasks' },
      ],
    }),

    // hard delete - only admin
    purgeTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/purge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),

    getTasksByMatterId: builder.query({
      query: ({ matterId, page = 1, limit = DEFAULT_PAGE_LIMIT }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        return { url: `/tasks/matters/${matterId}`, params };
      },
      providesTags: ['Tasks'],
    }),

    getTaskMatters: builder.query({
      query: ({ page = 1, limit = DEFAULT_PAGE_LIMIT } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        return { url: '/tasks/matters', params };
      },
      providesTags: ['TaskMatters'],
    }),

    getTaskStats: builder.query({
      query: () => ({
        url: '/tasks/stats',
      }),
      providesTags: ['Tasks'],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  usePurgeTaskMutation,
  useGetTasksByMatterIdQuery,
  useLazyGetTasksByMatterIdQuery,
  useGetTaskMattersQuery,
  useLazyGetTaskMattersQuery,
  useGetTaskStatsQuery,
} = taskApi;
