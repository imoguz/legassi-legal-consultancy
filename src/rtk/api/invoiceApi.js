import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

const DEFAULT_PAGE_LIMIT = 10;

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Invoice', 'Invoices', 'MatterInvoices'],
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (body) => ({
        url: '/invoices',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invoices'],
    }),

    getInvoiceById: builder.query({
      query: (id) => ({
        url: `/invoices/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    getInvoices: builder.query({
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
          url: '/invoices',
          params,
        };
      },
      providesTags: ['Invoices'],
    }),

    getInvoicesByMatter: builder.query({
      query: (matterId) => ({
        url: `/invoices/matter/${matterId}`,
      }),
      providesTags: (result, error, matterId) => [
        { type: 'MatterInvoices', id: matterId },
      ],
    }),

    updateInvoice: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoices' },
      ],
    }),

    issueInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/issue`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Invoice', id },
        { type: 'Invoices' },
      ],
    }),

    voidInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/void`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Invoice', id },
        { type: 'Invoices' },
      ],
    }),

    recalculateInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}/recalculate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Invoice', id },
        { type: 'Invoices' },
      ],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetInvoiceByIdQuery,
  useLazyGetInvoiceByIdQuery,
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useGetInvoicesByMatterQuery,
  useLazyGetInvoicesByMatterQuery,
  useUpdateInvoiceMutation,
  useIssueInvoiceMutation,
  useVoidInvoiceMutation,
  useRecalculateInvoiceMutation,
} = invoiceApi;
