import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const filtersApi = createApi({
  reducerPath: 'filtersApi',
  baseQuery: customBaseQuery,
  tagTypes: ['TaskFilters', 'MatterFilters'],
  endpoints: (builder) => ({
    getTaskFilters: builder.query({
      query: () => ({
        url: '/filters/tasks',
      }),
      providesTags: ['TaskFilters'],
    }),

    getMatterFilters: builder.query({
      query: () => ({
        url: '/filters/matters',
      }),
      providesTags: ['MatterFilters'],
    }),
  }),
});

export const {
  useGetTaskFiltersQuery,
  useLazyGetTaskFiltersQuery,
  useGetMatterFiltersQuery,
  useLazyGetMatterFiltersQuery,
} = filtersApi;
