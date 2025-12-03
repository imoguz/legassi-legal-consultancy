import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const aiDocumentSearchApi = createApi({
  reducerPath: 'aiDocumentSearchApi',
  baseQuery: customBaseQuery,
  tagTypes: ['AiDocumentSearches'],
  endpoints: (builder) => ({
    sendDocumentSearch: builder.mutation({
      query: ({ prompt }) => ({
        url: `/ai-document-search/query`,
        method: 'POST',
        body: { prompt },
      }),
      invalidatesTags: ['AiDocumentSearches'],
    }),

    getDocumentSearchHistory: builder.query({
      query: () => ({
        url: `/ai-document-search/history`,
      }),
      providesTags: ['AiDocumentSearches'],
    }),

    deleteUserSearchRecord: builder.mutation({
      query: (id) => ({
        url: `/ai-document-search/history/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AiDocumentSearches'],
    }),
  }),
});

export const {
  useSendDocumentSearchMutation,
  useGetDocumentSearchHistoryQuery,
  useLazyGetDocumentSearchHistoryQuery,
  useDeleteUserSearchRecordMutation,
} = aiDocumentSearchApi;
