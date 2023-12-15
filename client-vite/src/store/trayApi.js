import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const trayApi = createApi({
  reducerPath: "tray/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://192.168.24.215:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    getTray: build.query({
      query: () => ({
        url: "tray",
      }),
      providesTags:['Tray'],
    }),
    addToTray: build.mutation({
      query(body) {
        return {
          url: `tray/add`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Tray'],
    }),
    removeFromTray: build.mutation({
      query(body) {
        return {
          url: `tray/remove`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Tray'],
    }),
    printTray: build.mutation({
      query() {
        return {
          url: `tray/print`,
          method: "POST",
        };
      }
    }),
    clearTray: build.mutation({
      query(body) {
        return {
          url: `tray/clear`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Tray'],
    }),
  }),
});

export const { useGetTrayQuery, useAddToTrayMutation,useRemoveFromTrayMutation,useClearTrayMutation,usePrintTrayMutation } = trayApi;
