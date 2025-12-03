import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../customBaseQuery';

const DEFAULT_PAGE_LIMIT = 20;

export const calendarEventApi = createApi({
  reducerPath: 'calendarEventApi',
  baseQuery: customBaseQuery,
  tagTypes: ['CalendarEvents'],
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (body) => ({
        url: '/calendar-events',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CalendarEvents'],
    }),

    getEventById: builder.query({
      query: (id) => ({ url: `/calendar-events/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'CalendarEvents', id }],
    }),

    getEvents: builder.query({
      query: ({
        page = 1,
        limit = DEFAULT_PAGE_LIMIT,
        start,
        end,
        filters = {},
      } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (start) params.append('start', start);
        if (end) params.append('end', end);

        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (value != null && value !== '') {
            params.append(key, value);
          }
        });

        return { url: '/calendar-events', params };
      },
      providesTags: ['CalendarEvents'],
    }),

    updateEvent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/calendar-events/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CalendarEvents', id },
        { type: 'CalendarEvents' },
      ],
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({ url: `/calendar-events/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'CalendarEvents', id },
        { type: 'CalendarEvents' },
      ],
    }),

    purgeEvent: builder.mutation({
      query: (id) => ({
        url: `/calendar-events/purge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CalendarEvents'],
    }),

    getEventsByMatterId: builder.query({
      query: ({ matterId }) => ({ url: `/calendar-events/matter/${matterId}` }),
      providesTags: ['CalendarEvents'],
    }),

    getEventsByUserId: builder.query({
      query: ({ userId }) => ({ url: `/calendar-events/user/${userId}` }),
      providesTags: ['CalendarEvents'],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetEventByIdQuery,
  useLazyGetEventByIdQuery,
  useGetEventsQuery,
  useLazyGetEventsQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  usePurgeEventMutation,
  useGetEventsByMatterIdQuery,
  useLazyGetEventsByMatterIdQuery,
  useGetEventsByUserIdQuery,
  useLazyGetEventsByUserIdQuery,
} = calendarEventApi;
