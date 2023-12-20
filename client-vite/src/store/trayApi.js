import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "../config/config"

export const trayApi = createApi({
  reducerPath: "tray/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl+"/tray",
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
        url: "",
      }),
      providesTags:['Tray'],
    }),
    addToTray: build.mutation({
      query(body) {
        return {
          url: `/add`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Tray'],
    }),
    removeFromTray: build.mutation({
      query(body) {
        return {
          url: `/remove`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Tray'],
    }),
    printTray: build.mutation({
      query() {
        return {
          url: `/print`,
          method: "POST",
        };
      }
    }),
    clearTray: build.mutation({
      query(body) {
        return {
          url: `/clear`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Tray'],
    }),
  }),
});

export const { useGetTrayQuery, useAddToTrayMutation,useRemoveFromTrayMutation,useClearTrayMutation,usePrintTrayMutation } = trayApi;
