import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getMatterReport: builder.query({
      query: () => ({
        url: '/reports/matters',
      }),
      providesTags: ['Reports'],
    }),

    getTaskReport: builder.query({
      query: () => ({
        url: '/reports/tasks',
      }),
      providesTags: ['Reports'],
    }),

    getDocumentReport: builder.query({
      query: () => ({
        url: '/reports/documents',
      }),
      providesTags: ['Reports'],
    }),

    getUserReport: builder.query({
      query: () => ({
        url: '/reports/users',
      }),
      providesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetMatterReportQuery,
  useLazyGetMatterReportQuery,
  useGetTaskReportQuery,
  useLazyGetTaskReportQuery,
  useGetDocumentReportQuery,
  useLazyGetDocumentReportQuery,
  useGetUserReportQuery,
  useLazyGetUserReportQuery,
} = reportsApi;
