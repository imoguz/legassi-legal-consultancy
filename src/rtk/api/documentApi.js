import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Documents'],
  endpoints: (builder) => ({
    postDocument: builder.mutation({
      query: (formData) => ({
        url: '/documents',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Documents'],
    }),
    getDocumentById: builder.query({
      query: (id) => ({
        url: `/documents/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Documents', id }],
    }),

    getDocuments: builder.query({
      query: ({
        page = 1,
        limit = 20,
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
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (value != null && value !== '') {
            params.append(key, value);
          }
        });

        return {
          url: `/documents`,
          params,
        };
      },
      providesTags: ['Documents'],
    }),

    updateDocument: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/documents/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Documents', id },
        'Documents',
      ],
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),

    purgeDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/purge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const {
  usePostDocumentMutation,
  useGetDocumentByIdQuery,
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  usePurgeDocumentMutation,
} = documentApi;
