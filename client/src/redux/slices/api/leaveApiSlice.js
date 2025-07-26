import { apiSlice } from '../apiSlice';

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyLeave: builder.mutation({
      query: (data) => ({
        url: '/leave',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),
    getLeaveRequests: builder.query({
      query: () => '/leave',
      providesTags: ['Leave'],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ id, status, rejectionReason }) => ({
        url: `/leave/${id}`,
        method: 'PUT',
        body: { status, rejectionReason },
      }),
      invalidatesTags: ['Leave'],
    }),
    getUserLeaveRequests: builder.query({
      query: (id) => `/leave/user/${id}`,
      providesTags: ['Leave'],
    }),
  }),
});

export const { useApplyLeaveMutation, useGetLeaveRequestsQuery, useUpdateLeaveStatusMutation, useGetUserLeaveRequestsQuery } = leaveApiSlice; 