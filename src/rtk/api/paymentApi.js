import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

const DEFAULT_PAGE_LIMIT = 10;

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Payment', 'Payments', 'MatterPayments', 'InvoicePayments'],
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (body) => ({
        url: '/payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payments'],
    }),

    getPaymentById: builder.query({
      query: (id) => ({
        url: `/payments/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    getPayments: builder.query({
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
          url: '/payments',
          params,
        };
      },
      providesTags: ['Payments'],
    }),

    getPaymentsByMatter: builder.query({
      query: (matterId) => ({
        url: `/payments/matter/${matterId}`,
      }),
      providesTags: (result, error, matterId) => [
        { type: 'MatterPayments', id: matterId },
      ],
    }),

    getPaymentsByInvoice: builder.query({
      query: (invoiceId) => ({
        url: `/payments/invoice/${invoiceId}`,
      }),
      providesTags: (result, error, invoiceId) => [
        { type: 'InvoicePayments', id: invoiceId },
      ],
    }),

    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Payment', id },
        { type: 'Payments' },
      ],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentByIdQuery,
  useLazyGetPaymentByIdQuery,
  useGetPaymentsQuery,
  useLazyGetPaymentsQuery,
  useGetPaymentsByMatterQuery,
  useLazyGetPaymentsByMatterQuery,
  useGetPaymentsByInvoiceQuery,
  useLazyGetPaymentsByInvoiceQuery,
  useDeletePaymentMutation,
} = paymentApi;
