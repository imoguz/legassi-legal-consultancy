import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery";

export const legalAssistantApi = createApi({
  reducerPath: "legalAssistantApi",
  baseQuery: customBaseQuery,
  tagTypes: ["LegalChat", "LegalSession"],
  endpoints: (builder) => ({
    getConversationHistory: builder.query({
      query: (conversationId) => ({
        url: `/legal-assistant/sessions/${conversationId}`,
      }),
      providesTags: ["LegalChat"],
    }),

    getSessions: builder.query({
      query: ({ page = 1, limit = 20, archived = false } = {}) => ({
        url: "/legal-assistant/sessions",
        params: { page, limit, archived },
      }),
      providesTags: ["LegalSession"],
    }),

    updateSession: builder.mutation({
      query: ({ conversationId, title }) => ({
        url: `/legal-assistant/sessions/${conversationId}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["LegalSession"],
    }),

    deleteSession: builder.mutation({
      query: (conversationId) => ({
        url: `/legal-assistant/sessions/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LegalSession"],
    }),

    archiveSession: builder.mutation({
      query: (conversationId) => ({
        url: `/legal-assistant/sessions/${conversationId}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: ["LegalSession"],
    }),
  }),
});

export const {
  useGetConversationHistoryQuery,
  useGetSessionsQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useArchiveSessionMutation,
} = legalAssistantApi;
