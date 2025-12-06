// matterApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery";

const DEFAULT_PAGE_LIMIT = 20;

export const matterApi = createApi({
  reducerPath: "matterApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Matter", "Matters", "MatterStats", "MatterFinancials"],
  endpoints: (builder) => ({
    // CRUD Operations
    createMatter: builder.mutation({
      query: (body) => ({
        url: "/matters",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Matters", "MatterStats"],
    }),

    getMatterById: builder.query({
      query: (id) => ({
        url: `/matters/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Matter", id }],
    }),

    getMatters: builder.query({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_LIMIT,
        sortBy,
        sortOrder,
        search,
        filters = {},
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);

        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        if (search) params.append("search", search);

        // Backend-driven filtering için filtre parametrelerini ekle
        Object.entries(filters).forEach(([key, value]) => {
          if (value != null && value !== "") {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v));
            } else {
              params.append(key, value);
            }
          }
        });

        return {
          url: "/matters",
          params,
        };
      },
      providesTags: ["Matters"],
      // Transform response for consistent structure
      transformResponse: (response) => ({
        data: response.data || response,
        pagination: response.pagination || {
          total: response.length || 0,
          page: 1,
          limit: DEFAULT_PAGE_LIMIT,
          totalPages: Math.ceil((response.length || 0) / DEFAULT_PAGE_LIMIT),
        },
      }),
    }),

    updateMatter: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/matters/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Matter", id },
        { type: "Matters" },
      ],
    }),

    deleteMatter: builder.mutation({
      query: (id) => ({
        url: `/matters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Matter", id },
        { type: "Matters" },
        { type: "MatterStats" },
      ],
    }),

    // Hard delete - only admin
    purgeMatter: builder.mutation({
      query: (id) => ({
        url: `/matters/purge/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Matters", "MatterStats"],
    }),

    // Stats endpoint (tasks API'deki gibi)
    getMatterStats: builder.query({
      query: () => ({
        url: "/matters/stats",
      }),
      providesTags: ["MatterStats"],
    }),

    // Financial endpoints
    getMatterFinancialSummary: builder.query({
      query: (matterId) => ({
        url: `/matters/${matterId}/financial-summary`,
      }),
      providesTags: (result, error, matterId) => [
        { type: "MatterFinancials", id: matterId },
      ],
    }),

    updateMatterFinancials: builder.mutation({
      query: (matterId) => ({
        url: `/matters/${matterId}/update-financials`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, matterId) => [
        { type: "MatterFinancials", id: matterId },
        { type: "Matter", id: matterId },
      ],
    }),

    // Note Operations
    addNote: builder.mutation({
      query: ({ matterId, formData }) => ({
        url: `/matters/${matterId}/notes`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { matterId }) => [
        { type: "Matter", id: matterId },
      ],
    }),

    updateNote: builder.mutation({
      query: ({ matterId, noteId, formData }) => ({
        url: `/matters/${matterId}/notes/${noteId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { matterId }) => [
        { type: "Matter", id: matterId },
      ],
    }),

    deleteNote: builder.mutation({
      query: ({ matterId, noteId }) => ({
        url: `/matters/${matterId}/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { matterId }) => [
        { type: "Matter", id: matterId },
      ],
    }),
  }),
});

export const {
  useCreateMatterMutation,
  useGetMatterByIdQuery,
  useLazyGetMatterByIdQuery,
  useGetMattersQuery,
  useLazyGetMattersQuery,
  useUpdateMatterMutation,
  useDeleteMatterMutation,
  usePurgeMatterMutation,
  useGetMatterStatsQuery,
  useGetMatterFinancialSummaryQuery,
  useUpdateMatterFinancialsMutation,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = matterApi;
