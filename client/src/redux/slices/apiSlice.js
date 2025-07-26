import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = import.meta.env.VITE_APP_BASE_URL + "/api";
const API_URL = "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // Log the final URL before each request is sent
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user && user.token) {
        headers.set('Authorization', `Bearer ${user.token}`);
      }
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Task', 'Leave'], // Add 'Leave' tagType
  endpoints: (builder) => ({
    // Empty, as endpoints will be injected by other slices
  }),
});
