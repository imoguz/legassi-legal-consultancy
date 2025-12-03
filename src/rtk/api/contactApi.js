import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

const DEFAULT_PAGE_LIMIT = 10;

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Contacts'],
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (body) => ({
        url: '/contacts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contacts'],
    }),

    getContactById: builder.query({
      query: (id) => ({
        url: `/contacts/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Contacts', id }],
    }),

    getContacts: builder.query({
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
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (value != null && value !== '') {
            params.append(key, value);
          }
        });

        return {
          url: '/contacts',
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Contacts', id })),
              { type: 'Contacts', id: 'LIST' },
            ]
          : [{ type: 'Contacts', id: 'LIST' }],
    }),

    updateContact: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/contacts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contacts', id },
        { type: 'Contacts' },
      ],
    }),

    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Contacts', id },
        { type: 'Contacts' },
      ],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetContactByIdQuery,
  useLazyGetContactByIdQuery,
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;
