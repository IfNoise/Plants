import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "../config/config"

export const plantsApi = createApi({
  reducerPath: "plants/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl+"/api/plant",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    getPlants: build.query({
      query: (filter) => ({
        url: "plants",
        params: {
          filter: JSON.stringify(filter),
        },
      }),
      providesTags:['Action'],
    }),
    addAction: build.mutation({
      query(body) {
        return {
          url: `new_action`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Action'],
    })
  }),
});

export const { useGetPlantsQuery , useAddActionMutation,refetch } = plantsApi;
