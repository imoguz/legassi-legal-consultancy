import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Employees'],
  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query: (body) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employees'],
    }),

    getEmployeeById: builder.query({
      query: (id) => ({
        url: `/employees/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Employees', id }],
    }),

    getEmployees: builder.query({
      query: ({
        page = 1,
        limit = 10,
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
          url: '/employees',
          params,
        };
      },
      providesTags: ['Employees'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Employees', id },
        { type: 'Employees' },
      ],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Employees', id },
        { type: 'Employees' },
      ],
    }),

    purgeEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/purge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Employees', id },
        { type: 'Employees' },
      ],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useLazyGetEmployeeByIdQuery,
  useGetEmployeesQuery,
  useLazyGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  usePurgeEmployeeMutation,
} = employeeApi;
